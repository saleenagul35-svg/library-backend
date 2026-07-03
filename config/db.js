const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {

  }).then(() => {
    console.log("Mongoose connected");

  }).catch((error) => {
    console.log(error);

  })


}

module.exports = connectDB;


