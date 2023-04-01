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
  try {
    const { _id } = req.params; // Get that the post _id
    const query = { _id };

    // Connect to Mongo DB
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    // Connect to the database
    const db = client.db("SportsPickApp");
    // Find the post based on the provided post _id
    const post = db.collection("posts").findOne(query, (err, result) => {
      client.close();
      console.log("disconnected");
      result
        ? res.status(200).json({ status: 200, post: result })
        : res.status(404).json({
            status: 404,
            message: `Post info not found with the provided _id ${_id}`,
          });
    });
  } catch (err) {
    client.close();
    console.log("disconnected");
    console.log(err);
  }
};

module.exports = { getPostById };
