// Initial Setup
"use strict"
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var body = document.querySelector('body');


canvas.width = innerWidth;
canvas.height = innerHeight;
body.width = canvas.width;
body.height = canvas.height;


var resbtn = document.getElementById("btn");




//Key Listener

var keyPressed = {}

addEventListener("keydown", function(e){
	keyPressed[e.key] = true;
},false)



addEventListener("keyup",function(e){
	keyPressed[e.key] = false;
}, false)


// Variables
var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

var colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];


// Event Listeners
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});


// Color Palettes
var table = [
	"#048E1D",
	"#000000",
	"#16411E",
	"#8E0C23",
	"#FFFFFF"
];

function Background(palette) {
	this.palette = palette;

	this.set = function() {
		canvas.style.background = this.palette[0];
	}
	this.draw = function() {
		canvas.style.background = this.palette[0];
		c.fillStyle = this.palette[4];
		c.fillRect(0,canvas.height/2-15,canvas.width,30)
	}

	this.gameEnd = function() {
		c.clearRect(0, 0, canvas.width, canvas.height);

		canvas.style.background = this.palette[3];

		c.fillStyle = this.palette [1];
		c.font = "80px Amatic SC";

		c.textBaseline="bottom";
		c.fillText("GAME OVER",canvas.width/2,canvas.height/2);

		c.textBaseline="top";
		c.fillText(score,canvas.width/2,canvas.height/2);

		resbtn.style.display = "block";
	}
}
var background = new Background(table);
 background.set()


// Utility Functions
function gameRestart() {
	init();
	animate();
	resbtn.style.display = "none";
}
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}


//Collision Functions
function RectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2) || distY <= (rect.height/2)) {
		return true
	}


	//Corner Collision
    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}


// Objects
function Ball(x, y, radius, color,dx,dy) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.dx = dx;
	this.dy = dy;

	this.update = function() {
		if (this.y + this.radius + this.dy> canvas.height || this.y - this.radius <= 0) {
			this.dy = -this.dy;
		}
		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx
		}
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	};
}

function Racket(x,y,width,height,speed,color,btnup,btndown) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.color = color;
	this.btnup = btnup;
	this.btndown = btndown;

	this.draw = function(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);

	}

	this.update = function() {
		if(keyPressed[this.btndown] == true && this.y+this.height <= canvas.height) {
			this.y += this.speed;
		}
		if(keyPressed[this.btnup] == true && this.y >= 0) {
			this.y -= this.speed;
		}
		this.draw();
	}
};

var score;
var racketSpeed = 5;
var ball;
var racket;
var scoretemp = 0
var gameSpeeder = 0.005;
var gameOver;
var xSpeed;
var ySpeed;
// Implementation
function init() {
	xSpeed =-1;
	ySpeed =-1;
	gameOver = false;
	score = 0
	ball = new Ball(canvas.width/2,canvas.height/2, canvas.width/50,"white",xSpeed,ySpeed)
	racket = new Racket(
		canvas.width/25,
		canvas.height/5,
		canvas.width/50,
		canvas.height/4,
		racketSpeed
		,"black",
		"w","s"
	);
	c.font = "40px Amatic SC";
	c.textAlign = "center";
}

// Animation Loop
function animate() {
	if(ball.x - ball.radius <= 0) {
		gameOver = true;
	}
	if(gameOver === false) {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	background.draw();
	c.textBaseline="bottom";
	c.fillText("SCORE",canvas.width/2,canvas.height/10)
	c.textBaseline="top";
	c.fillText(score,canvas.width/2,canvas.height/10)
	//c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);
	ball.update();
	racket.update();


	if(RectCircleColliding(ball,racket) == true) {
		;
		if(scoretemp == 0) {
			ball.dx = - ball.dx;
			//ball.dy = - ball.dy;
			score += 1;
		}
		scoretemp = 2;

	}
	if(RectCircleColliding(ball,racket) == false) {
		scoretemp = 0;
	}
	ball.dx += ball.dx > 0 ? gameSpeeder : (gameSpeeder * -1)
	ball.dy += ball.dy > 0 ? gameSpeeder : (gameSpeeder * -1)
	} else {
		background.gameEnd();
		cancelAnimationFrame(animate);
}}

init();
animate();
