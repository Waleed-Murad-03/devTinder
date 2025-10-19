const express = require('express');

const app = express();

// This will only handle get http call to /user
app.get('/user', (req, res) => {
  res.send({ firstName: 'Lido', lastName: 'Murad' });
});

app.post('/user', (req, res) => {
  // Saving data to db
  res.send('Data successfully saved to the database');
});

app.delete('/user', (req, res) => {
  res.send('Deleted Successfully');
});

// 'use' will match all of the HTTP method API calls to /test
app.use('/test', (req, res) => {
  // This function right here is known as a request handler
  res.send('Hello from the server');
});

app.listen(7777, () => {
  console.log('Server is successfully listening on port 7777...');
});
