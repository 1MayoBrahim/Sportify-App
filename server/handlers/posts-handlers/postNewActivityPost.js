const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// The handler manages posting a new activity. It's called in the create activity page

const postNewActivityPost = async (req, res) => {
  try {
    // destructure all body keys that need validation
    const {
      limit,
      activityDate,
      activityAddress,
      activityType,
      description,
      level,
      creator_id,
    } = req.body;

    // Get today's date
    const d = new Date();
    let todayDate = d.toISOString();

    // Create the object for the new post to be added
    const newPostInfo = {
      ...req.body,
      creator_id: creator_id, // creator id
      _id: uuidv4(), // Post id
      joining: [{ _id: creator_id }], // Adding creator as a joiner also
      dateCreated: todayDate,
    };

    // Validate the form's inputs data
    if (
      activityDate.date === undefined ||
      activityDate.date === null ||
      activityDate.date === ""
    ) {
      return res
        .status(400)
        .json({ status: 404, message: "Please enter a valid date" });
    } else if (
      activityDate.from === undefined ||
      activityDate.from === null ||
      activityDate.from === ""
    ) {
      return res.status(400).json({
        status: 404,
        message: "Please enter a valid activity start time",
      });
    } else if (
      activityDate.to === undefined ||
      activityDate.to === null ||
      activityDate.to === ""
    ) {
      return res.status(400).json({
        status: 404,
        message: "Please enter a valid activity end time",
      });
    } else if (
      activityAddress.street === "" ||
      activityAddress.city === "" ||
      activityAddress.province === ""
    ) {
      return res
        .status(400)
        .json({ status: 404, message: "Please enter a valid address  info" });
    } else if (activityType === "Select" || activityType === "All") {
      return res
        .status(400)
        .json({ status: 404, message: "Please select the type of activity" });
    } else if (level === "select") {
      return res
        .status(400)
        .json({ status: 404, message: "Please select level required" });
    } else if (
      Number(limit) === 0 ||
      Number(limit) === 1 ||
      Number(limit) < 0 ||
      Number(limit) > 99
    ) {
      return res
        .status(400)
        .json({ status: 404, limit, message: "The limit should from 2 to 99" });
    } else if (description.length < 10) {
      return res.status(400).json({
        status: 404,
        message: "Please describe your activity in more than 10 letters",
      });
    }

    // Connect to the database
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    // Insert the new post to Posts Collection
    const db = client.db("Sportify");
    await db.collection("posts").insertOne(newPostInfo);

    // add the new post id to the current user profile data, specefically to joinedActivities and postedActivities array
    const query = { _id: creator_id };
    const newValueForPostedActivities = {
      $addToSet: { postedActivities: { _id: newPostInfo._id } },
    };
    const newValueForJoinedActivities = {
      $addToSet: { joinedActivities: { _id: newPostInfo._id } },
    };

    // Update the user profile in 'users' collection
    await db.collection("users").updateOne(query, newValueForPostedActivities);
    await db.collection("users").updateOne(query, newValueForJoinedActivities);

    // // Update the user profile in 'currentUser' collection

    client.close();
    console.log("disconnected");

    return res.status(200).json({
      status: 200,
      data: newPostInfo,
      message: "The new post have been submitted and published",
    });
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = { postNewActivityPost };
