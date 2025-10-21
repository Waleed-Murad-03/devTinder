const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error('Name is not valid');
  }
  //   } else if (firstName.length < 4 || firstName.length > 5) { //we could skip this because we already have validation checks for this on the schema level
  //     throw new Error('Firstname should be 4-50 characters');
  else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

module.exports = {
  validateSignUpData,
};
