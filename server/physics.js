const passBetween = require('./passBetween.js');

const gravity = () => {
  const update = {};
  const keys = Object.keys(passBetween.characters);
  for (let i = 0; i < keys.length; i++) {
    const current = passBetween.characters[keys[i]];
    if (current.destY < 400) {
      passBetween.characters[keys[i]].destY += 5;
      if (current.destY > 400) {
        passBetween.characters[keys[i]].destY = 400;
      }
      update[current.hash] = current;
    }
  }
  return update;
};

module.exports.gravity = gravity;
