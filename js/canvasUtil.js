// get canvas and 2d context
const canvas = document.querySelector("#weather-canvas");
const ctx = canvas.getContext("2d");
const canvasW = canvas.width;
const canvasH = canvas.height;

// assist functions
function drawRect(left, top, width, height, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(left, top, width, height);
}

function drawArc(x, y, radius, startAngle, endAngle, anticlockwise, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	ctx.closePath();
	ctx.fill();
}

// different kinds of sky
const skyBlue = "rgb(89, 171, 224)",
      grey = "rgb(97, 97, 97)",
      black = "rgb(0, 0, 0)",
      white = "rgb(255, 255, 255)";

const drawBlueSky = function(left, top, width, height) {
	return drawRect(left, top, width, height, skyBlue);
}

const drawGreySky = function(left, top, width, height) {
	return drawRect(left, top, width, height, grey);
}

const drawBlackSky = function(left, top, width, height) {
	return drawRect(left, top, width, height, black);
}

const drawWhiteSky = function(left, top, width, height) {
	return drawRect(left, top, width, height, white);
}

// 