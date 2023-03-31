const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// Handler for joining withdrawing for an activity
// If the user has not joined the activity yet, the handler will allow the user to join
// If the user has joined the activity, handler will allow the user to withdraw.

const putjoinByUserId = async (req, res) => {
    try {
        // Current user _id will be used to let user join or withdraw from an activity\

        // The post _id will determine the activity the current user is targeting

        const { currentUser, postData } = req.body;

        // Find the post with post _id and find current user _id in the joining array
        const query = { _id: postData._id, "joining._id": currentUser._id };

        // Connect to Mongo DB
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected")

        // Connect to database
        const db = client.db("Sportify");

        // Find the post with the provided query
        const post = db.collection("posts").findOne(query, async(err, result) => {
            // If result is found, it means the user has already joined and the endpoint will handle withdraw from activity
           if ( result ) {
            // create a notification to add the post creator profile when current user join their activity
            const date = new Date;
            const notification = {
                _id: uuidv4(),
                date: date.toISOString(),
                type:"withdraw",
                user:{
                    _id: currentUser._id,
                    imgSrc:currentUser.imgSrc,
                    displayName: currentUser.display,

                },
                activity:{
                    id: postData._id,
                    type:postData.activityType,
                    date:postData.activityDate,
                },
                message:"withdraw from your activity",
            }
           // Query to find the targeted post activity
           const postQuery = { _id:postData._id };
           // The update is to remove the  current user from the activity
           const removeUserFromPost = { $pull: { joining: { _id:currentUser._id } } };
           // Find the post and remove the current user from the activity
           const resultPostUpdate = await db.collection("posts").updateOne(postQuery, removeUserFromPost);

           // Query to find a user and remove the joined activity from the profile
           const userQuery = { _id: currentUser._id };
           // The update is to remove activity_id  from the user profile
           const removeActivityFromUser = { $pull: { joinedActivities: { _id: postData._id} }};
           // Find the user that remove the post from the user profile
           // and will also remove the user from current logged in user profile
           const resultUserUpdate = await db.collection("users").updateOne(userQuery, removeActivityFromUser);

           // Send notification to the activity creator and update that the current user joined the activity
           const postCreatorQuery = { _id: postData.creator_id };
           const updateNotifications = { $addToSet: { notifications: { ... notification} }};
           const resultUpdateNotifications = await db.collection("users").updateOne(postCreatorQuery, updateNotifications);

           client.close();
           console.log("disconnected");
         
          return res.status(200).json({status: 200, message: "user has withdraw from the activity"})
    }

    // If no result is found, it means the user has not joined the activity and 
        // therefore the end point will handle joining
     else {
        // create a notification to add to the post creator profile when current user join their activity
        const date = new Date;
        const notification = {
            _id: uuidv4(),
            date: date.toISOString(),
            type:"Join",
            user:{
                _id:currentUser._id,
                imgSrc:currentUser.imgSrc,
                displayName: currentUser.displayName
            },
            activity:{
                _id:postData._id,
                type:postData.activityType,
                date:postData.activityDate,
            },
            message: "joined your activity",
        }

        // Query to find the targeted post activity for the user
        const postQuery = { _id:postData._id };
        // The update to add the current user to the activity
        const addUserToPost = { $push: { joining: { _id: currentUser._id } } };

        // Find the post and add the current user to the activity
        const resultPostUpdate = await db.collection("posts").updateOne(postQuery, addUserToPost);

        // Query to find a user and add the joined activity to the profile
        const userQuery = { _id: currentUser._id };
        // The update to add the activity _id to the user profile
        const addPostToUser = { $push: { joinedActivities: { _id: postData._id } } };
        // Find the user with userQuery and add the post id to the user profile
        // It will also remove the user from current logged in user profile
        const resultUserUpdate = await db.collection("users").updateOne(userQuery, addPostToUser);

        // Send notification to the activity creator that current user joined the activity
         const postCreatorQuery = { _id: postData.creator_id };
         const updateNotifications = { $addToSet: { notification: { ... notification } } };
         const resultUpdateNotifications = await db.collection("users").updateOne(postCreatorQuery, resultUpdateNotifications);
         console.log("Notification update", resultUpdateNotifications);

         client.close();
         console.log("disconnected");

         return res.status(200).json({status: 200, message: "user has joined the activity"});
     } 

  });
 }  catch (err) {
    client.close();
    console.log("disconnected");
    console.log("Error: " , err);
 }
};

module.exports = { putjoinByUserId}