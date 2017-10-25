const lerp = (v0, v1, alpha) => {
    return (1 - alpha) * v0 + alpha * v1;
  };

const redraw = (time) => {
    //update this user's positions
    updatePosition();
  
    ctx.clearRect(0, 0, 500, 500);
  
    //each user id
    const keys = Object.keys(squares);
  
    //for each user
    for(let i=0; i<keys.length; i++){
      let square = squares[keys[i]];
      //if alpha less than 1, increase it by 0.01
      if(square.alpha < 1) square.alpha += 0.05;
  
      //applying a filter effect to other characters
      //in order to see our character easily
      if(square.hash === hash) {
        ctx.filter = "none"
      }
      else {
        ctx.filter = "hue-rotate(40deg)";
      }
  
      //calculate lerp of the x/y from the destinations
      square.x = lerp(square.prevX, square.destX, square.alpha);
      square.y = lerp(square.prevY, square.destY, square.alpha);
  
      // if we are mid animation or moving in any direction
      ctx.fillStyle = "#FF00FF";
      //draw our characters
      ctx.fillRect(
        square.x, 
        square.y, 
        100, 
        100
      );
    };
    
    //set our next animation frame
    animationFrame = requestAnimationFrame(redraw);
};