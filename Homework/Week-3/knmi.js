// Kim de Bie, 11077379
// KNMI exercise. Creates an HTML canvas object that displays temperature data.

var rawdata = document.getElementById('rawdata').innerHTML;
var lines = rawdata.split("\n");
var times = [];
var temperatures = [];

// getting the data into two arrays; one for temperatures and one for dates
for (var i = 1; i < lines.length-1; i++) {
	lines[i].replace("\"","");
	var split = lines[i].split(",");
	var date = new Date(split[0]).getTime();
	var temperature = split[1];
	times.push(date);
	temperatures.push(temperature);
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
for(var i = 0; i < temperatures.length; i++){
	temperatures[i] = transformtemp(temperatures[i]);
};

// transforming the dates
var mindate = Math.min.apply(Math, times);
var maxdate = Math.max.apply(Math, times);
var transformdates = createTransform([mindate, maxdate],[100,950]);
for (var i = 0; i < times.length; i++){
	times[i] = transformdates(times[i]);
};

// building the canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// draws temperature coordinates
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
ctx.beginPath();
ctx.strokeStyle = "black";
ctx.lineWidth = 1;
ctx.moveTo(95,50);
ctx.lineTo(95,500);
ctx.stroke();
// add rotated label
ctx.font = "15px Lucida Sans Unicode";
ctx.save();
ctx.translate(40, 275);
ctx.rotate(-Math.PI/2);
ctx.textAlign = "center";
ctx.fillText("Temperature in degrees Celcius", 0, 0);
ctx.restore();

// draw x axis
ctx.beginPath();
ctx.moveTo(100,500);
ctx.lineTo(950,500);
ctx.stroke();
// add label
ctx.fillText("Month", 500, 580);

// draw y axis bars and numbers
for (var i = 0; i < 9; i++){
	// draw bars
	ctx.beginPath();
	ctx.moveTo(95,500-i*(450/8));
	ctx.lineTo(90,500-i*(450/8));
	ctx.stroke();
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
	ctx.beginPath();
	ctx.moveTo(100+i*(850/12),500);
	ctx.lineTo(100+i*(850/12),505);
	ctx.stroke();
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