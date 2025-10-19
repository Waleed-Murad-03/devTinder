const express = require('express');

const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

// Handle auth middleware for all requests (GET,PATCH, POST,PATCH).
app.use('/admin', adminAuth);

app.post('/user/login', (req, res) => {
  res.send('User logged in successfully!');
});

app.get('/user', userAuth, (req, res) => {
  res.send('User all data');
});

app.get('/admin/getAllData', (req, res) => {
  res.send('Get all data');
});

app.get('/admin/deleteUser', (req, res) => {
  res.send('Deleted a user');
});

app.listen(7777, () => {
  console.log('Server is successfully listening on port 7777...');
});
