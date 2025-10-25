const express = require('express');

const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileEditData } = require('../utils/validation');

// Get profile
// So basically remeber that first when check the code of the userauth middleware if all is good it will execute the next from there and go to the code of async (req, res) below here in the profile.
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;

    // console.log(cookies); // We are getting undefined so we need some middleware which will help me read the cookie and that will be cookie-parser.
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileEditData(req)) {
      throw new Error('Invalid edit request');
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = profileRouter;
