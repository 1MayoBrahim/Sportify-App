// This handler is used to delete everything about a specific post from the database
// The the handler's endpoint might not be used in the frontend
// Instead, another handler called cancelPostById will cancel that activity

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This is a very important handler that is used to delete all activity related data of
// of specific post in the databse. It's not being used in the client side (frontend) of
// this version of the app.Rather, it is important to be used to in the testing process
// in case an activity post needs to be deleted completely.

const deletePostById = async (req, res) => {
  try {
    const { _id } = req.params;
    const query = { _id };

    // Connect to Mongo DB
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    // Connect to the database
    const db = client.db("Sportify");

    // Delete the post from 'posts' collection
    await db.collection("posts").deleteOne(query);

    // Use $pull operator to remove an all given instances from an existing array
    const removeDeletedPostFromAllUsers = {
      $pull: { postedActivities: { _id }, joinedActivities: { _id } },
    };

    // Update all the users profiles in 'users' collection
    await db
      .collection("users")
      .updateMany({}, removeDeletedPostFromAllUsers, { multi: true });

    // Update all the users profiles in 'currentUser' collection
    await db
      .collection("currentUser")
      .updateMany({}, removeDeletedPostFromAllUsers, { multi: true });

    client.close();
    console.log("disconnected");

    return res.status(200).json({
      status: 200,
      data: _id,
      message: "The post with provided id has been deleted",
    });
  } catch (err) {
    client.close();
    console.log("disconnected");
    console.log("Error:", err);
  }
};

module.exports = { deletePostById };
