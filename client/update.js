const update = (data) => {
    // add new
    if(!squares[data.hash]) {
        squares[data.hash] = data;
        return;
    }
    //get rid of old
    if(squares[data.hash].lastUpdate >= data.lastUpdate) {
        return;
    }
    const square = squares[data.hash];
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
}

const removeUser = (data) => {
    //if we have that character, remove them
    if(squares[data.hash]) {
      delete squares[data.hash];
    }
};

const setUser = (data) => {
    hash = data.hash; //set this user's hash to the unique one they received
    squares[hash] = data; //set the character by their hash
    requestAnimationFrame(redraw);
};

const jump = () => {
    const square = squares[hash];
    square.prevX = square.x;
    square.prevY = square.y;
    square.destY -=200;
    square.alpha = 0.05;
    socket.emit('movementUpdate', square);
}

const updatePosition = () => {
    const square = squares[hash];
  
    //move the last x/y to our previous x/y variables
    square.prevX = square.x;
    square.prevY = square.y;

     //if user is moving left, decrease x
    if(square.moveLeft && square.destX > 0) {
        square.destX -= 2;
    }
    //if user is moving right, increase x
    if(square.moveRight && square.destX < 400) {
        square.destX += 2;
    }
    square.alpha = 0.05;
    socket.emit('movementUpdate', square);
};