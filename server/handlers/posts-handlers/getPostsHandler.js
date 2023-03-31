const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This handler gets all the posts based on the database
// data there for posts are small, the homefeed displays all posts in the database.
// 2 queries have been added to filter the posts: activity type, and level required
//

const getPosts = async (req, res) => {
  try {
    const { activityType, level } = req.params;
    let query = [];

    // Check the filters and create a query based on filters values
    if (activityType === "All" && level === "All") {
      query = {};
    } else if (activityType && level === "All") {
      query = {};
    } else if (activityType && level) {
      query = { activityType, level };
    }

    const client = new MongoClient(MONGO_URI, options);

    await client.connect();
    console.log("connected");

    const db = await client.db("Sportify");
    const posts = await db.collection("posts").find(query).toArray();
    client.close();
    console.log("disconnected");

    res.status(200).json({ status: 200, posts });
  } catch (error) {
    client.close();
    console.log("disconnected");
    console.log("Error:", err);
  }
};

module.exports = { getPosts };
