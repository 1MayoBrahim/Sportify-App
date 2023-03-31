const { config } = require("dotenv");
const { MongoClient } = require("mongodb");

require("dotenv"), config();

const options = {
  userNewUrlParsers: true,
  useUnifiedTopology: true,
};

// Handler will gets an activity post data from the database

const getPosById = async (req, res) => {
  try {
    const { _id } = req.params; // to get the post _id
    const query = { _id };

    // Connect to MongoDB
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    // Connect to the database
    const db = client.db("Sportify");

    // Find the post based on the provided post _id
    const post = db.collection("posts").findOne(query, (err, result) => {
      client.close();
      console.log("disconnected");
      result
        ? res.status(200).json({ status: 200, post: result })
        : res.status(404).json({
            status: 404,
            message: `No post found with the provided _id ${_id}`,
          });
    });
  } catch (err) {
    client.close();
    console.log("disconnected");
    console.log(err);
  }
};

module.exports = { getPosById };
