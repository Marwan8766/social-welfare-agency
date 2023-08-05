const socketIo = require('socket.io');

let io;

function initSocket(server) {
  console.log(`server init: ${server}`);
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });
  console.log(`io init: ${io}`);
}

function getSocketIo() {
  console.log(`io get: ${io}`);
  return io;
}

module.exports = {
  initSocket,
  getSocketIo,
};
