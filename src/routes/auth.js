const epxress = require('express');
const authRouter = epxress.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);
    // Encrypt the password and then store this into the database.
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
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

authRouter.post('/login', async (req, res) => {
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
      res.send(user);
    } else {
      throw new Error('Invalid crendentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send('Logout Succesful');
});

module.exports = authRouter;
