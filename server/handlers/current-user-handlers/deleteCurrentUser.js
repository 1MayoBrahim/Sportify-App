const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// ******************************************************************
// The handler clears the data of logged out user from
// the 'currentUser' collection in database
// ***************************************************************

const deleteCurrentUser = async (req, res) => {
  const { email } = req.params;
  const query = { email };
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("Sportify");

    client.close();
    console.log("disconnected");

    return res
      .status(200)
      .json({ status: 200, email, message: "user logged out successfully" });
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = { deleteCurrentUser };
