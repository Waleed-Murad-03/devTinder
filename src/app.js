const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json()); // this method basically reads the json code it got and then converts into javascript object. Also please note that this is a middleware.
app.use(cookieParser()); // This middleware will help me be able to read the cookies instead of getting undefined.

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
connectDB()
  .then(() => {
    console.log('database connected successfully');
    app.listen(7777, () => {
      console.log('Server is successfully listening on port 7777...');
    });
  })
  .catch((err) => {
    console.error('Database cannot be connected');
  });
