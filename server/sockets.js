const xxh = require('xxhashjs');
const passBetween = require('./passBetween.js');
const physics = require('./physics.js');

let io;

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;
    socket.join('room1');
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
    socket.hash = hash;
    passBetween.newCharacter(hash);
    socket.emit('joined', passBetween.characters[hash]);

    socket.on('movementUpdate', (data) => {
            // trusting the client like we trust our parents
      passBetween.characters[socket.hash] = data;
      passBetween.characters[socket.hash].lastUpdate = new Date().getTime();

      io.sockets.in('room1').emit('updatedMovement', passBetween.characters[socket.hash]);
    });

    setInterval(() => {
      const updates = physics.gravity();
      const keys = Object.keys(updates);
      for (let i = 0; i < keys.length; i++) {
        io.sockets.in('room1').emit('updatedMovement', passBetween.characters[keys[i]]);
      }
    }, 20);
    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('left', passBetween.characters[socket.hash]);

      passBetween.deleteChar(socket.hash);

      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
