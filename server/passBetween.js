const Player = require('./classes/player.js');

const characters = {};

const newCharacter = (hash) => {
  characters[hash] = new Player(hash);
};

const deleteChar = (hash) => {
  delete characters[hash];
};

module.exports.newCharacter = newCharacter;
module.exports.characters = characters;
module.exports.deleteChar = deleteChar;
