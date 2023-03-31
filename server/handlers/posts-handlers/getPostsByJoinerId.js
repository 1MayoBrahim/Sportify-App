const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This handler will gets all the activities posts that a specific user has joined
//The posts data is then displayed the user profile

const getPostsByJoinerId = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const { _id } = req.params;

    const query = { "joining._id": _id };
    const db = client.db("Sportify");
    // Go through all the posts and find the posts that have targeted user in "joining" array
    client.close();
    console.log("disconnected");

    res.status(200).json({ status: 200, posts });
  } catch (err) {
    client.close("disconnected");
    console.log("Error: ", err);
  }
};

module.exports = { getPostsByJoinerId };
