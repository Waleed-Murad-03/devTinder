const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
// require('./utils/cronjob');
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json()); // this method basically reads the json code it got and then converts into javascript object. Also please note that this is a middleware.
app.use(cookieParser()); // This middleware will help me be able to read the cookies instead of getting undefined.

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

// We are creating a server for web socket. (Live chat feature)
const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log('database connected successfully');
    // Here below I am changing from app to server.
    server.listen(process.env.PORT, () => {
      console.log('Server is successfully listening on port 7777...');
    });
  })
  .catch((err) => {
    console.error('Database cannot be connected');
    console.error(err);
  });
