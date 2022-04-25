const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  await mongoose.connection;
  } catch (err) {
    console.error(err);
  }
};

module.exports.connectToDb = connect;