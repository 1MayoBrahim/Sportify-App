const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// ***********************************************************************
// This update handler takes care of updating the followers
// and following users info in the database
//************************************************************************

const updateFollowingUsers = async (req, res) => {
  const { currentUser, targetUser } = req.body;

  // Connect to the database
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Sportify");
  await client.connect();
  console.log("connected");

  //Initially, we need to determine if the current user is already following the targeted user. Depending on this, there could be two possible updates:
  // Scenario 1 - If the current user is not following the targeted user, the endpoint will handle the follow action.
  // Scenario 2 - If the current user has already followed the targeted user, the endpoint will handle the unfollow action.

  const query = { _id: targetUser._id, "followers._id": currentUser._id };
  db.collection("users").findOne(query, async (err, result) => {
    // Scenario 1 - If the current user is not following the targeted user, the endpoint will handle the follow action.
    if (result) {
      // We want to update two thing
      // 1- the following array that contains all the accounts the current user is following
      // 2- the followers array that contains the accounts that follow a user
      const updateFollowing = { $pull: { following: { _id: targetUser._id } } };
      const updateFollowers = {
        $pull: { followers: { _id: currentUser._id } },
      };

      // Update the users both the follower ( current user ) and the followed user in users collection
      const resultFollowingUser = await db
        .collection("users")
        .updateOne({ _id: currentUser._id }, updateFollowing);

      const resultFollowedUser = await db
        .collection("users")
        .updateOne({ _id }, updateFollowers);

      // Update the current user info in the currentUser collection
      const resultCurrentUser = await db
        .collection("currentUser")
        .updateOne({ _id: currentUser._id }, updateFollowing);

      client.close();
      console.log("disconnect");

      return res.status(200).json({
        status: 200,
        message: "You have unfollowed this account successfully",
      });
    }

    // Case 2: a result is not found, which means that current user has not followed the targeted user
    // so the endpoint will handle following
    else {
      // We want to update 3 things
      // 1- the following array that contains all the accounts the current user is following
      // 2- the followers array that contains the accounts that follow a user
      // 3- Add a notification to the targeted user profile

      const date = new Date();

      const notification = {
        _id: uuidv4(),
        date: date.toISOString(),
        type: "follow",
        user: {
          _id: currentUser._id,
          imgSrc: currentUser._id,
          displayName: currentUser.displayName,
        },
        activity: undefined,
        message: "started following you",
      };
      const updateFollowing = {
        $addToSet: { following: { _id: targetUser._id } },
      };
      const updateFollowers = {
        $addToSet: { followers: { _id: currentUser._id } },
      };
      const updateNotifications = {
        $addToSet: { notifications: { ...notification } },
      };

      // Update the users both the follower ( current user ) and the followed user in users collection
      // Update the users both the follower ( current user ) and the followed user in users collection
      const resultFollowingUser = await db
        .collection("users")
        .updateOne({ _id: currentUser._id }, updateFollowing);

      const resultFollowedUser = await db
        .collection("users")
        .updateOne({ _id: targetedUser._id }, updateFollowers);

      // // Update the current user info in the currentUser collection
      // const resultCurrentUser = await db.collection("currentUser").updateOne({ _id: currentUser._id }, updateFollowing );

      //Add the notifications to the targeted user profile
      const resultNotifications = await db
        .collection("users")
        .updateOne({ _id: targetedUser._id }, updateNotifications);

      client.close();

      return res
        .status(200)
        .json({
          status: 200,
          message: "You have followed this account successfully",
        });
    }
  });
};

module.exports = { updateFollowingUsers };
