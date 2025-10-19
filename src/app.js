const express = require('express');

const app = express();

// In here basically whenever we add a '?' it means it is optional.
// So in here the /abc route and also /ac route will work.
app.get('/user/:userId/:name/:password', (req, res) => {
  console.log(req.params);
  res.send({ firstName: 'Lido', lastName: 'Murad' });
});

app.listen(7777, () => {
  console.log('Server is successfully listening on port 7777...');
});
