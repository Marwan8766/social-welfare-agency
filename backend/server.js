const http = require('http');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const socketIo = require('socket.io');
const app = require('./app');
const socketManager = require('./utils/socket');
const { getAllCases, getOneCase } = require('./controllers/caseController');
const { protectSocket } = require('./controllers/authController');

const server = http.createServer(app);

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION, server is shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // that is what i added due to terminal error
  })
  .then(() => console.log('DB is connected...'));

const port = process.env.PORT;

console.log(`server server: ${server}`);
// socketManager.initSocket(server);

server.listen(port, `0.0.0.0`, () => {
  console.log(`Server running on port ${port}...`);
});
server.timeout = 120000; // 120 seconds

// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//   },
// });
const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

process.io = io;

io.use(async (socket, next) => {
  console.log(`auth...`);
  console.log(`token: ${socket.handshake.auth.token}`);
  try {
    console.log(`auth...`);
    // socket.handshake.auth.token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzkwYjkwYzlkZjRlMjU5MDU4Y2FhOCIsImlhdCI6MTY5MDg5NzMzMSwiZXhwIjoxNjkzNDg5MzMxfQ.p1c3wElgKhn3Dcr4pqHGJ0Z4lyDbcbMePc_iVe3Kb-U';
    if (socket.handshake.auth && socket.handshake.auth.token) {
      const token = socket.handshake.auth.token;
      await protectSocket(token, socket);
      next(); // Continue if authentication is successful
    } else {
      throw new Error('Authentication error');
    }
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the error handling middleware
  }
});

io.on('connection', (socket) => {
  process.socket = socket;
  // Listen for the fetchCasesList event
  socket.on('fetchCasesList', async () => {
    console.log('fetchcases...');
    try {
      console.log('fetchcases.. from socket.');
      // Assuming the user information is available in socket.user
      const user = socket.user;

      // Call the function to get cases
      const cases = await getAllCases(user);

      // Emit the cases to the connected client
      socket.emit('casesList', cases);
    } catch (error) {
      // Handle errors if any
      console.error('Error fetching cases:', error.message);
    }
  });

  socket.on('fetchCase', async (caseId) => {
    try {
      // Assuming the user information is available in socket.user
      const user = socket.user;

      // Call the function to get the specific case
      const caseDoc = await getOneCase(user, caseId);

      // Emit the case to the connected client
      socket.emit('case', caseDoc);
    } catch (error) {
      // Handle errors if any
      console.error('Error fetching case:', error.message);
    }
  });

  socket.on('error', (err) => {
    if (err && err.message === 'unauthorized event') {
      socket.disconnect();
    }
  });
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, server is shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
