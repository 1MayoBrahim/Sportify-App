const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// ***********************************************************************************
// This handler is used to let the user log in. It validates the user credentials and
// save the current user info in the database in 'currentUser' collection
// ************************************************************************************

const getLoggedInUser = async (req, res) => {
  const { email, password } = req.query;
  const query = { email };

  if (email === "") {
    return res
      .status(400)
      .json({ status: 400, message: "Please enter your email address" });
  } else if (password === "") {
    return res
      .status(400)
      .json({ status: 400, message: "Please enter your password" });
  }
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("Sportify");
    // Look up for a user when they entered email address
    const user = db.collection("users").findOne(query);

    if (user) {
      if (password === user.password) {
        client.close();
        console.log("connected");
        return res
          .status(200)
          .json({
            status: 200,
            result: user,
            message: "User logged in successfully",
          });
      } else {
        client.close();
        console.log("disconnected");
        return res
          .status(404)
          .json({
            status: 404,
            message: "Incorrect email address or password, please try again",
          });
      }
    } else {
      client.close();
      console.log("disconnected");
      return res
        .status(404)
        .json({
          status: 404,
          message: "Incorrect email address or password, please try again",
        });
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = { getLoggedinUser };
