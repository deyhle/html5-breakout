/** BREAKOUT in HTML5 (Canvas)
 * Ruben Deyhle
 * ruben@deyhle.eu
 */     

function breakout_load() {
	var game = new breakout();
	game.init();	
}	

function breakout() {
		
	var gameWidth = 500; // default: 500
	var gameHeight = 400; // default: 400
	var anzBricksHorizontal = 7; // default: 7
	var anzBricksVertical = 5; // default: 5
	var speed = 8; // default: 8
	
	/* dont change anything below*/ 
	var mouseX = 0;	
	var mouseY = 0;
	
	var ballX = 0;
	var ballY = 0;
	
	var velX = 0.0;
	var velY = 0.0;
	
	var barX = 0;
	
	var bricks;
	
	var startzustand = true;
	
	function mouseMove(ev) { 
		var canvas = document.getElementById('breakout'); 
		var x;
		var y;
		// Get the mouse position relative to the canvas element.
		x = ev.clientX-canvas.offsetLeft;
		y = ev.clientY-canvas.offsetTop;	
		
		mouseX = x;
		mouseY = y;
	}
	
	function mouseDown(ev) { // ball abfeuern
		if (startzustand) {
			startzustand = false;
		}	
	}
	
	function draw() {
		
		var canvas = document.getElementById('breakout'); 
		var context = canvas.getContext('2d');
		
		context.clearRect(0,0,gameWidth,gameHeight); // zurücksetzen
		context.fillStyle = "rgb(240,240,240)";
		context.fillRect(0,0,gameWidth,gameHeight);
		
		moveBar();
		abprallWinkel();
		drawBricks();
		moveBall();
		
		if (startzustand) {
			initBricks();	
		}	
		
		if (ballY>gameHeight) { // game over
			initBricks();
			startzustand = true; 
		}
		setTimeout(function(breakout) { draw(); }, 15, this);
	}	
	
	function abprallWinkel() { // berechnet eventuell neue Bewegungsrichtung
		var meetingBar = false;
		if (ballX >= barX && ballX <= barX+100 && ballY >= gameHeight-30) {
			meetingBar = true;
		}
		
		if (startzustand || meetingBar) { // unten
			positionOnBar = ballX - barX;
			if (positionOnBar <= 50) {
				if (positionOnBar <30) positionOnBar = 30;
				velX = -0.8 + positionOnBar*0.016;
				velY = 0.2 + positionOnBar*0.016;
			} else {
				if (positionOnBar>70) positionOnBar = 70;
				velX = 0.2 + (positionOnBar-50)*0.016;
				velY = 0.8 - (positionOnBar-50)*0.016;
			}
		} else {
			if (ballY < 10) { //oberer Rand => gewonnen
				startzustand = true;
				initBricks();  
			}
			if (hitBrick()) {
				velY = velY * -1; // Brick berühren, abprallen
				return;
			}
			if (ballX < 10) {velX=velX*-1.;} //linkerRand 
			if (ballX > gameWidth-10) { velX = velX * -1; } //rechter Rand 
				
		}	
	}	
	
	function hitBrick() { // prüft ob 
		var brickWidth = gameWidth/anzBricksHorizontal;
		var brickX = Math.floor(ballX/brickWidth);
		var brickHeight = 10;
		var brickY = Math.floor((ballY-10)/brickHeight);
		//window.console.log(brickX+","+brickY);
		if (brickY<0) brickY=0;
		if (brickY<bricks.length && brickX<bricks[0].length) {
			if (bricks[brickY][brickX] == true) {
				bricks[brickY][brickX]=false;
			return true;
			}	
		} 
		return false;
	}	
	
	function moveBall() { // bewegt den ball
		if (startzustand) {
			ballX = mouseX+10;
			if (ballX<60) ballX = 60;
			if (ballX>gameWidth-40) ballX = gameWidth-40;
			ballY = gameHeight-30;
		} else {
			ballX = ballX + velX*speed;
			ballY = ballY - velY*speed;
		}
		drawBall();
	}	
	
	function drawBricks() {
		var canvas = document.getElementById('breakout'); 
		var context = canvas.getContext('2d');
		
		context.strokeStyle = "rgb(255,255,255)";
		
		var brickWidth = gameWidth/anzBricksHorizontal;
		var brickHeight = 10;
		
		for (y=0; y<bricks.length; y++) {
			var grauwert = ((10+y)*30)%255;
			context.fillStyle = "rgb("+grauwert+","+grauwert+","+grauwert+")";
			for (x=0; x<bricks[y].length; x++) {
				if (bricks[y][x] == true) {
					var brickX = x*brickWidth;
					var brickY = y*brickHeight;
					context.fillRect(brickX,brickY,brickWidth,brickHeight);
					context.strokeRect(brickX,brickY,brickWidth,brickHeight);
					
				}	
			}		
		}	
	}	
	
		
	
	function drawBall() { // zeichnet den ball
		var canvas = document.getElementById('breakout'); 
		var context = canvas.getContext('2d');
		
		context.fillStyle = "rgb(50,50,50)";
		context.beginPath();
		context.arc(ballX,ballY,10,0,Math.PI*2, false);
		context.fill();
		context.closePath();
	}	
	
	function moveBar() { // bewegt den schläger
		var canvas = document.getElementById('breakout'); 
		var context = canvas.getContext('2d');
		
		barX = mouseX-50;
		if (barX<0) barX = 0;
		if (barX>gameWidth-100) barX = gameWidth-100;
		context.fillStyle = "rgb(150,150,150)";
		context.fillRect(barX,gameHeight-20,100,20);
	}
	
	function initBricks() { // initialisiert die Klötze oben
		var brickLine = new Array(anzBricksHorizontal);
		for (var i=0; i<brickLine.length; i++) {
			brickLine[i] = true;
		}	
		bricks = new Array(anzBricksVertical);
		for (var i=0; i<bricks.length; i++) {
			bricks[i] = brickLine.concat();
		}	
		
	}
	
	
	this.init = function() { 
		
		var canvas = document.getElementById('breakout'); 
		var context = canvas.getContext('2d');
		
		initBricks();
		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('mousedown', mouseDown, false);
		
		draw();
	}
}