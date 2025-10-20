const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json()); // this method basically reads the json code it got and then converts into javascript object. Also please note that this is a middleware.

app.post('/signup', async (req, res) => {
  // Creating a new instance of a user model.
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error saving the user:' + err.message);
  }
});

// Now just for practicing we will try to find one user from the database.
// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send('User not found');
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// Feed API- GET /feed - get al users from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send('Something went wrong');
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
