const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('Please  Login');
    }

    // Now verify the token

    const decodedObj = await jwt.verify(token, 'DEV@Tinder$790');

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next(); //We are using next here to move on to the request handler

    // Validate the token
    // Find the user
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
};

module.exports = {
  userAuth,
};
