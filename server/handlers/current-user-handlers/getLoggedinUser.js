const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This handler is used to let the user log in. It validates the user credentials and
// save the current user info in the database in 'currentUser' collection

const getLoggedinUser = async (req, res) => {
  const { email, password } = req.query;

  const query = { email };

  if (email === "") {
    return res
      .status(400)
      .json({ status: 404, message: "Please enter your email address" });
  }
  if (password === "") {
    return res
      .status(400)
      .json({ status: 404, message: "Please enter your password" });
  }

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("Sportify");
    // Look up for a user when the entered email address
    const exitingUser = await db.collection("users").findOne(query);
    if (exitingUser) {
      const cmp = await bcrypt.compare(password, exitingUser.password);
      if (cmp || password === exitingUser.password) {
        client.close();
        console.log("disconnected");
        return res.status(200).json({
          status: 200,
          exitingUser,
          message: "User logged in successfully",
        });
      }
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = { getLoggedinUser };
