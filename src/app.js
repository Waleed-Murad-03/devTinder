const express = require('express');
const app = express();

app.get('/getUserData', (req, res) => {
  // Logic of db call and get user data
  throw new Error('wghetj');
  res.send('User data sent');
});

app.use('/', (err, req, res, next) => {
  if (err) {
    // Log your error.
    res.status(500).send('Something went wrong');
  }
});

app.listen(7777, () => {
  console.log('Server is successfully listening on port 7777...');
});
