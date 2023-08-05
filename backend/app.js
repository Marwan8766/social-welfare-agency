const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/appErrorController');

const cors = require('cors');
const app = express();

app.use(cors());

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const benefitRouter = require('./routes/benefitRoutes');
const caseRouter = require('./routes/caseRoutes');

app.use(express.json());
// Middleware to parse urlencoded data
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/benefits', benefitRouter);
app.use('/api/v1/cases', caseRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl} on this server!`, 400));
});

// IMPLEMENTING a global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
