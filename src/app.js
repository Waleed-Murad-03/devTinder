const express = require('express');

const app = express();

app.use(
  '/user',
  (req, res, next) => {
    // Route Handler ().
    // res.send('Rounte Handler 1');
    console.log('Handling the rout user');
    next();
    res.send('Respone!!!');
  },
  (req, res) => {
    // Route Handler 2.
    console.log('Handling the rout user 2!!');
    res.send('2nd Respone!!!');
  }
);

app.listen(7777, () => {
  console.log('Server is successfully listening on port 7777...');
});
