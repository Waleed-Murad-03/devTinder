const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res) => {
  // Creating a new instance of a user model.
  const user = new User({
    firstName: 'Virat',
    lastName: 'Koli',
    emailId: 'virat.murad@gmail.com',
    password: 'virat@123',
  });

  try {
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error saving the user:' + err.message);
  }
});

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
