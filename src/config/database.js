const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://namastedev:nwzCx8tu9mD8sobF@namastenode.dyih4pe.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
