const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// *************************************************************************
// The handler gets an activity post data from the database
// *************************************************************************

const getPostById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    const { _id } = req.params; // Get that the post _id
    const query = { _id };

    // Connect to Mongo DB

    await client.connect();
    console.log("connected");

    // Connect to the database
    const db = client.db("Sportify");
    // Find the post based on the provided post _id
    const post = await db.collection("posts").findOne(query);

    if (post) {
      return res.status(200).json({ status: 200, post });
    } else {
      return res.status(404).json({ status: 404, message: "post not found" });
    }
  } catch (err) {
    client.close();
    console.log("disconnected");
    console.log(err);
  }
};

module.exports = { getPostById };
