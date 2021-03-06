class Player {
  constructor(hash) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.destX = 0;
    this.destY = 0;
    this.lerp = 0;
    this.moveLeft = false;
    this.moveRight = false;
  }
}

module.exports = Player;
