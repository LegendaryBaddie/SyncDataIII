"use strict";

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

var redraw = function redraw(time) {
  //update this user's positions
  updatePosition();

  ctx.clearRect(0, 0, 500, 500);

  //each user id
  var keys = Object.keys(squares);

  //for each user
  for (var i = 0; i < keys.length; i++) {
    var square = squares[keys[i]];
    //if alpha less than 1, increase it by 0.01
    if (square.alpha < 1) square.alpha += 0.05;

    //applying a filter effect to other characters
    //in order to see our character easily
    if (square.hash === hash) {
      ctx.filter = "none";
    } else {
      ctx.filter = "hue-rotate(40deg)";
    }

    //calculate lerp of the x/y from the destinations
    square.x = lerp(square.prevX, square.destX, square.alpha);
    square.y = lerp(square.prevY, square.destY, square.alpha);

    // if we are mid animation or moving in any direction
    ctx.fillStyle = "#FF00FF";
    //draw our characters
    ctx.fillRect(square.x, square.y, 100, 100);
  };

  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var squares = {};
var animationFrame = void 0;

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var square = squares[hash];

  // A OR LEFT
  if (keyPressed === 65 || keyPressed === 37) {
    square.moveLeft = true;
  }
  // D OR RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      square.moveRight = true;
    }
};

//handler for key up events
var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
  var square = squares[hash];
  // A OR LEFT
  if (keyPressed === 65 || keyPressed === 37) {
    square.moveLeft = false;
  }
  // D OR RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      square.moveRight = false;
    }
    //Space key was lifted
    else if (keyPressed === 32) {
        jump();
      }
};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('left', removeUser); //when a user leaves

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;
'use strict';

var update = function update(data) {
    // add new
    if (!squares[data.hash]) {
        squares[data.hash] = data;
        return;
    }
    //get rid of old
    if (squares[data.hash].lastUpdate >= data.lastUpdate) {
        return;
    }
    var square = squares[data.hash];
    square.prevX = data.prevX;
    square.prevY = data.prevY;
    square.destX = data.destX;
    square.destY = data.destY;
    square.direction = data.direction;
    square.moveLeft = data.moveLeft;
    square.moveRight = data.moveRight;
    square.moveDown = data.moveDown;
    square.moveUp = data.moveUp;
    square.alpha = 0.05;
};

var removeUser = function removeUser(data) {
    //if we have that character, remove them
    if (squares[data.hash]) {
        delete squares[data.hash];
    }
};

var setUser = function setUser(data) {
    hash = data.hash; //set this user's hash to the unique one they received
    squares[hash] = data; //set the character by their hash
    requestAnimationFrame(redraw);
};

var jump = function jump() {
    var square = squares[hash];
    square.prevX = square.x;
    square.prevY = square.y;
    square.destY -= 200;
    square.alpha = 0.05;
    socket.emit('movementUpdate', square);
};

var updatePosition = function updatePosition() {
    var square = squares[hash];

    //move the last x/y to our previous x/y variables
    square.prevX = square.x;
    square.prevY = square.y;

    //if user is moving left, decrease x
    if (square.moveLeft && square.destX > 0) {
        square.destX -= 2;
    }
    //if user is moving right, increase x
    if (square.moveRight && square.destX < 400) {
        square.destX += 2;
    }
    square.alpha = 0.05;
    socket.emit('movementUpdate', square);
};
