/* Kim de Bie, 11077379
 * KNMI exercise. Creates an HTML canvas object that displays temperature data.
 */

/*
Loading and transforming data
*/

var rawData = JSON.parse(document.getElementById('rawdata').innerHTML);
var times = [];
var temperatures = [];
var fullDates = [];
var untransformedTemperatures = [];

// getting the data into two arrays; one for temperatures and one for dates
for (var i = 1; i < rawData.length-1; i++) {
	var date = rawData[i][0];
	date = date.substring(0,4) + "/" + date.substring(4,6) + "/" + date.substring(6,8);
	var datestamp = new Date(date).getTime();
	var temperature = rawData[i][1]/10.0;
	fullDates.push(date);
	times.push(datestamp);
	untransformedTemperatures.push(temperature);
};

// function for transforming the data
function createTransform(domain, range){
	// domain is a two-element array of the domain's bounds
	// range is a two-element array of the range's bounds
	var beta = -((range[1]-range[0])/(domain[1]-domain[0]))*domain[1]+range[1];
	var alpha = (range[1]-range[0])/(domain[1]-domain[0]);
	return function(x){
		return alpha * x + beta;
	};
};

// transforming the temperatures
var transformtemp = createTransform([-5, 35], [50,500]);
for(var i = 0; i < untransformedTemperatures.length; i++){
	temperatures[i] = transformtemp(untransformedTemperatures[i]);
};

// transforming the dates
var mindate = Math.min.apply(Math, times);
var maxdate = Math.max.apply(Math, times);
var transformdates = createTransform([mindate, maxdate],[100,950]);
for (var i = 0; i < times.length; i++){
	times[i] = transformdates(times[i]);
};

/*
Building the graph (non-interactive canvas)
*/

// function to draw (straight) lines
function drawLine(context, xStart, yStart, xLine, yLine){
	context.beginPath();
	context.moveTo(xStart, yStart);
	context.lineTo(xLine, yLine);
	context.stroke();
};

// building the canvas
var canvas = document.getElementById('drawCanvas');
var ctx = canvas.getContext('2d');

// draw temperature coordinates
ctx.beginPath();
ctx.strokeStyle = "red";
ctx.lineJoin = "round";
ctx.lineWidth = 2;
ctx.moveTo(times[0],550-temperatures[0]);
for (var i = 1; i < times.length; i++){
	ctx.lineTo(times[i], 550-temperatures[i]);
};
ctx.stroke();

// draw y axis
ctx.strokeStyle = "black";
ctx.lineWidth = 1;
drawLine(ctx, 95, 50, 95, 500);

// add rotated label
ctx.font = "15px Lucida Sans Unicode";
ctx.save();
ctx.translate(40, 275);
ctx.rotate(-Math.PI/2);
ctx.textAlign = "center";
ctx.fillText("Temperature in degrees Celcius", 0, 0);
ctx.restore();

// draw x axis and label
drawLine(ctx, 100, 500, 950, 500);
ctx.fillText("Month", 500, 580);

// draw y axis bars and numbers
for (var i = 0; i < 9; i++){
	// draw bars
	drawLine(ctx, 95, 500-i*(450/8), 90, 500-i*(450/8));
	// draw numbers
	var text = -5+5*i;
	ctx.font = "12px Lucida Sans Unicode";
	ctx.textAlign = "right";
	ctx.fillText(text, 85, 500-i*(450/8)+4);
};

// draw x axis bars and month names
var months = ["November", "December", "2015", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November"]
for (var i = 0; i < 13; i++){
	// draw bars
	drawLine(ctx, 100+i*(850/12), 500, 100+i*(850/12), 505);
	// draw rotated month names
	ctx.save();
	ctx.translate(100+i*(850/12), 505);
	ctx.rotate(-55 * Math.PI / 180);
	ctx.fillText(months[i], -5, 0);
	ctx.restore();
}

// draw title
ctx.font = "bold 25px Lucida Sans Unicode";
ctx.textAlign = "center";
ctx.fillText("Maximum temperatures in De Bilt (NL), 2014-2015", 500, 40);

/*
Building the crosshair and tooltip (interactive canvas)
*/

var canvas2 = document.getElementById('interactiveCanvas');
var ctx2 = canvas2.getContext('2d');

// drawing the crosshair on a clean canvas every time the mouse moves
document.addEventListener("mousemove", function(event){
	document.getElementById('tooltip').innerHTML = '';
    x = event.pageX - canvas2.offsetLeft;
    XCoordinate = findXCoordinate(x);
    y = 550-temperatures[XCoordinate];
    // only draw crosshair within graph itself
    if (x >= 100 && x <= 950 && y >= 50 && y <= 500){
    	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    	drawLine(ctx2, 95, y, 950, y);
    	drawLine(ctx2, x, 50, x, 500);       
	    tooltip = setTimeout(drawTooltip, 1000);
	};       
});

function findXCoordinate(x){
	// transform date coordinate back to number in list (so transform to length of list)
	var transformBack = createTransform([100,950],[0, times.length]);
	// find the position of this date in the list of dates
	return Math.round(transformBack(x));
};

// drawing the tooltip using SVG elements
function drawTooltip(){
	var date = fullDates[XCoordinate];
	var temperature = untransformedTemperatures[XCoordinate].toFixed(1);

	// creating content and position of temperature box
	if (x > 300){
		var positionTemp = 150;
	}	else {
		var positionTemp = 700;
	};
	var positionTempText = positionTemp+4;
	var ytext = y+15;
	var temperatureBox = '<svg width="1000" height="600"> <rect x="'+ positionTemp + '" y="'+ y + '" width="50" height="20"/><text x="' + positionTempText + '" y="' + ytext  + '">' + temperature + ' &deg;C</text>';

	// creating content and position of date box
	if (y > 200){
		var positionDate = 400;
	} else {
		var positionDate = 70;
	};

	var positionDateText = positionDate+15;
	var xtext = x+5;
	var dateBox = '<rect x="'+ x + '" y="'+ positionDate + '" width="85" height="20"/><text x="' + xtext + '" y="' + positionDateText  + '">' + date + '</text></svg>';

	var content = temperatureBox + dateBox;
	document.getElementById('tooltip').innerHTML = content;
};