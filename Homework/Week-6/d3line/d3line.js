/* 
 * Kim de Bie, 11077379
 * Drawing a line graph using D3.
 *
 * Note: I had some issues loading the json-data. The only thing that seems to work is running
 * a Python webserver AND changing Chrome security for local files. 
 * https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally <== So I used both solutions combined
 *
 * I built on the D3 features mentioned at the top of this page:
 * http://bl.ocks.org/mbostock/3883245
 */ 

// setting the sizes for the graph
var margin = {top: 50, bottom: 50, left: 50, right: 50};
var width = 1000 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

// sorry for magic numbers - couldn't figure it out! :(
var minDate = 1388530800000;
var maxDate = 1419980400000;
var minTemp = -5;
var maxTemp = 35; 

// formatting dates correctly
var parseDate = d3.time.format("%Y%m%d").parse;

/* first, setting the variables that later will be called */

// svg element which will contain the graph
var svg = d3.select("body").append("svg")
	.attr("class", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// for the scales/axes I took guidance from http://bl.ocks.org/mbostock/1166403
// and https://github.com/mbostock/d3/wiki/SVG-Axes

// scales for x and y 
var xScale = d3.time.scale()
	.range([0, width])
   	.domain([minDate, maxDate]);

var yScale = d3.scale.linear()
   	.range([height, 0])
   	.domain([minTemp, maxTemp]);

// the x and y axis 
var xAxis = d3.svg.axis()
	.scale(xScale)

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("right");

var line = d3.svg.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.temperature); });

// the tooltip lines

var tooltip = svg.append("g");

tooltip.append("line")
	.attr("class", "tooltipLine")
	.attr("id", "tooltipLineX");
tooltip.append("line")
	.attr("class", "tooltipLine")
	.attr("id", "tooltipLineY");

/* creating the axes: these do not depend on data */

svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
.append("text")
	.attr("class","tick")
	.attr("id", "datelabel")
    .attr("x", 10)
    .attr("y", -10)
    .style("text-anchor", "start")
    .text("Month");

svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + width + ",0)")
	.call(yAxis)
.append("text")
	.attr("class", "tick")
	.attr("id", "templabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("Temperature in Celcius");


/* loading the data and drawing the graph */

d3.json("http://localhost:8000/jsondata.json", function(error, json){
	if (error) return console.warn(error);
	var data = json;

	// transforming the data that was just loaded
	data.forEach(function(d) {
    	d.date = parseDate(d.date);
    	d.temperature = d.temperature/10;
  	});

	// drawing the line
	svg.append("path")
		.attr("class", "line")
	    .datum(data)
	    .attr("d", line)

	// drawing the tooltip
	svg.append("rect")
		.attr("class", "tooltip")
		.attr("width", width)
		.attr("height", height)
		.on("mouseover", function(){
			d3.selectAll(".tooltipLine")
            	.style('display', null);
		})
		.on('mousemove', function(){
			var mouse = d3.mouse(this);
			var mouseDate = xScale.invert(mouse[0]);

			// the mouse is (almost) never exactly at a day at 00:00:00 (which is how dates are stored)
			// therefore I am only comparing day, month and year
			var mouseDay = mouseDate.getDate();
			var mouseMonth = mouseDate.getMonth(); 
			var mouseYear = mouseDate.getFullYear();

			// finding the corresponding temperature
			for(var i = 0; i < data.length; i++){
				var arrayDay = data[i].date.getDate();
				var arrayMonth = data[i].date.getMonth();
				var arrayYear = data[i].date.getFullYear();
  				if (mouseDay == arrayDay && mouseMonth == arrayMonth && mouseYear == arrayYear){
    				var mouseTemperature = data[i].temperature;
    				break;
  				};
			};

			var x = mouse[0];
			var y = yScale(mouseTemperature);

			tooltip.select("#tooltipLineX")
                .attr("x1", x)
                .attr("y1", yScale(minTemp))
                .attr('x2', x)
                .attr('y2', yScale(maxTemp));
            tooltip.select("#tooltipLineY")
                .attr('x1', xScale(minDate))
                .attr('y1', y)
                .attr('x2', xScale(maxDate))
                .attr('y2', y);

            var format = d3.time.format('%d %B %Y');
            var printDate = format(mouseDate);

            // change text in axis labels to data
            d3.select("#datelabel")
            	.text(printDate);

            d3.select("#templabel")
            	.text(mouseTemperature + " Celcius");
		})

		// when the mouse moves outside the graph, change label text back
		// and hide tooltip
		.on("mouseout", function(){

			d3.select("#datelabel")
            	.text("Month");

            d3.select("#templabel")
            	.text("Temperature in Celcius");

            d3.selectAll(".tooltipLine")
            	.style('display', 'none');


		});


});

