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
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");

    const { _id } = req.params;

    const query = { "joining._id": _id };
    const db = client.db("Sportify");
    // Go through all the posts and find the posts that have targeted user in "joining" array

    const allPost = await db.collection("posts").find().toArray();

    const joingPosts = [];

    allPost.forEach((post) => {
      post.joining.forEach((person) => {
        if (person._id === _id) {
          joingPosts.push(post);
        }
      });
    });

    client.close();
    console.log("disconnected");

    res.status(200).json({ status: 200, posts: joingPosts });
  } catch (err) {
    client.close("disconnected");
    console.log("Error: ", err);
  }
};

module.exports = { getPostsByJoinerId };
