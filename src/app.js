const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

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
    // Logic of validating password is now in the user schema model.
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a jwt token - I can find the logic for it in the user schema model
      const token = await user.getJWT();

      // Add the token cookie and then send response back to the user
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send('Login Successful');
    } else {
      throw new Error('Invalid crendentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Get profile
// So basically remeber that first when check the code of the userauth middleware if all is good it will execute the next from there and go to the code of async (req, res) below here in the profile.
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;

    // console.log(cookies); // We are getting undefined so we need some middleware which will help me read the cookie and that will be cookie-parser.
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
  const user = req.user;
  // Sending connection request
  console.log('Sending a connection request');
  res.send(user.firstName + ' Sent the connection request');
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
