const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This handler function is used to retrieve a user's information based on
// on the user unique _id

const getUserById = async (req, res) => {
  console.log("callllllllll");
  const { _id } = req.params;
  const query = { _id };
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("Sportify");
    const user = await db.collection("users").findOne(query);
    console.log("user", user);
    if (user) {
      return res.status(200).json({ status: 200, user });
    } else {
      return res.status(404).json({ status: 404, message: "user not found" });
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = { getUserById };
