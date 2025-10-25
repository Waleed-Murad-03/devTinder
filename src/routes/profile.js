const express = require('express');

const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

// Get profile
// So basically remeber that first when check the code of the userauth middleware if all is good it will execute the next from there and go to the code of async (req, res) below here in the profile.
profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;

    // console.log(cookies); // We are getting undefined so we need some middleware which will help me read the cookie and that will be cookie-parser.
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = profileRouter;
