/*
 * Kim de Bie, 11077379
 * Exploring institutional economic theory & the relationship between institutions and economic performance.
 * Using D3 and several socioeconomic datasets.
 */


/* Setting an (initially empty) map */

var map = new Datamap({
  element: document.getElementById('worldmap'),
  projection: 'mercator',
  fills: {
    defaultFill: '#CDCCCC',
  },
  geographyConfig: {
    highlightFillColor: '#fdbb84',
    highlightBorderColor: '#fc8d59',
    highlightBorderWidth: 1,    
  }
});

/* Once a data source is selected from dropdown, load the data */

function loadData(){
  queue()
    .defer(d3.json, 'http://localhost:8000/jsondatagini.json')
    .defer(d3.json, 'http://localhost:8000/jsondatapolity.json')
    .defer(d3.json, 'http://localhost:8000/jsondataGNI.json')
    .await(createVisualization);
};

/* Creating the visualization */ 

function createVisualization(error, giniData, polityData, GNIData){

  // load GNI Data
  var gni = {}
  GNIData.forEach(function(country){
      gni[country["country"]] = [{ year: 2005, value: country["2005"]}, {year: 2006, value: country["2006"]}, {year: 2007, value: country["2007"]}, {year: 2008, value: country["2008"]}, {year: 2009, value: country["2009"]}, {year: 2010, value: country["2010"]}, {year: 2011, value: country["2011"]}, {year: 2012, value: country["2012"]}, {year: 2013, value: country["2013"]}, {year: 2014, value: country["2014"]}];
    });

  // remove old map and reset dataset
  document.getElementById('worldmap').innerHTML = '';
  document.getElementById('starter').innerHTML = '';
  document.getElementById('explainer').innerHTML = '';
  var dataset = {}

  // check which dataset is selected and load/color appropriately
  var type = document.getElementById("dropdown").value;

  if (type == "gini"){
    giniData.forEach(function(country){
      dataset[country["country"]] = { score: country["gini"], fillColor: determineGiniColor(country["gini"]) };
    });
    // change explanation text
    document.getElementById('explainer').innerHTML = "<p>The <b>Gini Index</b> shows income distribution on the" 
    + " national level. If a country has a Gini Index of 0, all citizens have exactly the same income. In constrast, "
    + "if a country's Gini Index is 100, all national income is in the hands of one individual. Equality is generally an"
    + " indicator of stronger political institutions, and should thus correlate with better economic performance. <b><i>Click on a country"
    + " to see for yourself!</i></b> For each country, the most recent Gini Index from 2010-2015 was selected (if available).</p>"

  } else if (type == "polity"){
    polityData.forEach(function(country){
      dataset[country["country"]] = { score: country["polity"], fillColor: determinePolityColor(country["polity"]) }
    });
    // change explanation text
    document.getElementById('explainer').innerHTML = "<p>The <b>Polity IV Index</b> indicates the regime type of "
    + "a country, and indicates whether a country is an autocracy (red), an anocracy (an in-between form; orange) or a democracy (green)."
    + " Regime type is a strong indicator of the quality of the political institutions of a country. As such, institutional economic theory"
    + " predicts that democratic countries will be more successful economically. <b><i>Click on a country to test the hypothesis!</i></b> This visualization"
    + " includes the Polity IV Index from 2014.</p>"
  };

  // setting the map with right data
  var map = new Datamap({
    element: document.getElementById('worldmap'),
    projection: 'mercator',
    fills: {
      defaultFill: '#CDCCCC',
    },
    data: dataset,
    geographyConfig: {
      highlightFillColor: '#fdbb84',
      highlightBorderColor: '#fc8d59',
      highlightBorderWidth: 1,    
      popupTemplate: function(geo, data) {
        return ['<div class="hoverinfo"><strong>',
        geo.properties.name,
        ': ' + data.score,
        '</strong></div>'].join('');
      }
    },

    // adding the second element: bar chart for GNI per capita, appears on click
    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function updateBarChart(geo) {
        
        // empty the element first (of any existing bar chart)
        document.getElementById('barchart').innerHTML = ''
        
        // add the bar chart
        // based on the following example: http://bl.ocks.org/Caged/6476579
        data = gni[geo.id]

        // setting the size of the bar chart
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        // computing the data domains
        var x = d3.scale.ordinal()
            .domain(data.map(function(d) { return d.year; }))
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return d.value; }))
            .range([height, 0])
            .nice();

        // creating the axis prototypes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")

        // creating the tooltip
        // from http://bl.ocks.org/Caged/6476579
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>GNI change in " + d.year + ":</strong> <span style='color:red'>" + Math.round(d.value * 100) / 100 + "</span>";
            })
        
        // creating the svg element that will contain the bar chart
        var svg = d3.select("#barchart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        // drawing the x axis
        svg.append("g")
            .attr("class", "y axis")
          .append("line")
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("x1", 0)
            .attr("x2", width);

        // drawing the y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("GNI Change (%)");

        // drawing the bars
        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(d.year); })
            .attr("y", function(d, i) { return y(Math.max(0, d.value)); })
            .attr("width", x.rangeBand())
            .attr("height", function(d, i) { return Math.abs(y(d.value) - y(0)); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

       // add explanatory footer
      document.getElementById('barchartexplainer').innerHTML = "<p> This graph shows changes in Gross National Income in <b>" 
        + geo.properties.name + "</b> in % between 2005-2014. <i>(If no values are shown, data is not available.)</i></p>"
      });

}
})};


/* Helper functions to determine colors */

function determineGiniColor(gini){
  if (gini < 30) {
    return "#fee5d9";
  } else if (gini < 40) {
    return "#fcae91";
  }   else if (gini < 50) {
    return "#fb6a4a";
  } else if (gini < 60) {
    return "#de2d26";
  } else if (gini < 70) {
    return "#a50f15";
  } else {
    return "#cccccc";
  }
};

function determinePolityColor(polity){
  if (polity < -5){
    return "#d7191c"
  } else if (polity < 6){
    return "#fdae61"
  } else {
    return "#a6d96a"
  }
};

/* Displaying the design justification. */

function show(object) {
  var text = document.getElementById(object);
  if (text.style.display == "block"){
    text.style.display = "none";
  } else {
    text.style.display = "block";
  }
};