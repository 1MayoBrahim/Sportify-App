const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// This handler function is used to handle adding a new user to the database
// It's endpoint is called when a new user signs up from the sign-up page

const addNewUser = async (req, res) => {
    try {
        // Destructing the user inputs for validation 
      const {
        displayName,
        email,
        DOB,
        location,
        password,
        confirmPassword,
        imgSrc,
      } = req.body;

      // Query to check if this email account already exists
      const query = { email };

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password,saltRounds );

      // Write the date 
      const d =  new Date();
      let todayDate = d.toISOString();

     // add the new data user data with all other initial values for a new user
     const newUserInfo = 
     { ...req.body,
        password: hashedPassword,// used the hashed password
        _id: uuidv4(), // create a new _id for the new user
        followers:[], // Followers are saved in an array of followers
        following:[], // Followings are saved in an array of following users
        joined: todayDate,
        postedActivities:[], // posted activities are saved in an array of each posted activity
        joinedActivities:[], // joined activities are saved in an array of each joined activity.
        Notifications:[] // notifications details contains the user,activity,notification type, and notification message
    }

    // Validate the users inputs
    if( password === "" ){
        return res.status(400).json({ status: 400, data:newUserInfo,  message: "Your password is missing"})
    }
    else if( password !== confirmPassword ){
        return res.status(400).json({ status: 400, data:newUserInfo,  message: "Passwords don't match"})
    }
    else if( displayName === ""){
        return res.status(400).json({ status: 400, data:newUserInfo,  message: "Your full name is missing"})
    }
    else if ( email === ""){
        return res.status(400).json({ status: 400,data:newUserInfo, message: "Your email is missing"})
    }
    else if ( DOB === ""){
        return res.status(400).json({ status: 400,data:newUserInfo, message: "Your date of birth is missing"})
    }
    else if ( imgSrc === ""){
        return res.status(400).json({ status: 400,data:newUserInfo, message: "Your profile image is missing"})
    }
    else if ( location === ""){
        return res.status(400).json({ status: 400,data:newUserInfo, message: "Your city is missing"})
    }


    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("SportsPickApp");

    // Check if there is already an account with the registered email
    const result = await db.collection("users").find(query).toArray();

    if(result.length !== 0){
        client.close();
        console.log("disconnected");
        return res.status(400).json({ status: 400, result:newUserInfo,  message: "An account with the provided email already exists"})
    };

    await db.collection("users").insertOne(newUserInfo);

    client.close();
    console.log("disconnected");

    // if all inputs pass the validation, then allow the user to create the new account
    return res.status(200).json({ status: 200, data: newUserInfo, message: "User info has been added"})

} catch (err) {
    console.log("Error:", err);
}
};

module.exports = { addNewUser }
