const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json()); // this method basically reads the json code it got and then converts into javascript object. Also please note that this is a middleware.
app.use(cookieParser()); // This middleware will help me be able to read the cookies instead of getting undefined.

app.post('/signup', async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);
    // Encrypt the password and then tore this into the database.
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    // Creating a new instance of a user model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid crendentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create a jwt token
      const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder$790');
      // Add the token cookie and then send response back to the user
      res.cookie('token', token);
      res.send('Login Successful');
    } else {
      throw new Error('Invalid crendentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Get profile
app.get('/profile', async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      throw new Error('Invalid Token');
    }

    const decodedMessage = await jwt.verify(token, 'DEV@Tinder$790');
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User does not exist');
    }
    // console.log(cookies); // We are getting undefined so we need some middleware which will help me read the cookie and that will be cookie-parser.
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
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

// Feed API- GET /feed - get all users from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

// Delete a user from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// Update data of the user
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  // Below are the only fields that we should be able to update.
  // If any of the fields we are trying to update are not in the list below it will not work
  // due to the below strict handling.

  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }
    if (data?.skills.length > 10) {
      throw new Error('Skills can not be more than 10');
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.send('User updated Successfully');
  } catch (err) {
    res.status(400).send('Update Failed:' + err.message);
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
