const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This handler is used to get the activity posts the creator _id
// The post data is then displayed the creator user profile

const getPostsByCreatorId = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const { _id } = req.params;

    const query = { creator_id: _id };

    const db = client.db("Sportify");
    // Look up for all posts that are created by the user with the provided _id (creator_id)
    const posts = await db.collection("posts").find(query).toArray();

    client.close();
    console.log("disconnected");

    res.status(200).json({ status: 200, posts });
  } catch (err) {
    client.close();
    console.log("disconnected");
  }
};

module.exports = { getPostsByCreatorId }
