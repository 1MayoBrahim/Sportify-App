// Import libraries.
const path = require("path");
const express = require("express");
let session = require("express-session");
const { getUsers } = require("./handlers/users-handlers/getUsers");
const { getUserById } = require("./handlers/users-handlers/getUserById");
const { addNewUser } = require("./handlers/users-handlers/addNewUser");
const {
  getLoggedinUser,
} = require("./handlers/current-user-handlers/getLoggedinUser");
const {
  deleteCurrentUser,
} = require("./handlers/current-user-handlers/deleteCurrentUser");
const { getPosts } = require("./handlers/posts-handlers/getPostsHandler");
const {
  getPostsByCreatorId,
} = require("./handlers/posts-handlers/getPostsByCreatorId");
const {
  getPostsByJoinerId,
} = require("./handlers/posts-handlers/getPostsByJoinerId");
const {
  postNewActivityPost,
} = require("./handlers/posts-handlers/postNewActivityPost");
const {
  deletePostById,
} = require("./handlers/posts-handlers/deletePostByPostId");
const { getPostById } = require("./handlers/posts-handlers/getPostByPostId");
const {
  putjoinByUserId,
} = require("./handlers/posts-handlers/putJoinActivity");
const {
  updateFollowingUsers,
} = require("./handlers/current-user-handlers/followUsers");
const { chatSocket } = require("./chat-socket/index");
const {
  getLoginSession,
  postLoginSession,
  deleteLoginSession,
} = require("./handlers/express-session-handlers/express-session-handlers");
const socketIo = require("socket.io");

const cors = require("cors");
var bodyParser = require("body-parser");

const PORT = 8000;
const frontUrl = "http://localhost:3000";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    cookie: { maxAge: 1000 * 60 * 60 }, // expire in one-hour
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json({ limit: "50mb" }));

// Get all users
app.get("/users", getUsers);
// Get a single user by unique _id number
app.get("/users/:_id", getUserById);
// When a user signs up with a new account, post the new user info
app.post("/users/add", addNewUser);
// Store user info in 'current user collection' when a user sigs in or sings up
app.get("/loggedin", getLoggedinUser);
// When a user signs out, clear the data from 'currentUser' collection
app.delete("/loggedout/:email", deleteCurrentUser);
// Update the following array for the current user and the followers arrays for the user that's being followed
app.put("/users/follow", updateFollowingUsers);

// Get all posts in the database
app.get("/posts", getPosts);
// Get all posts by creator _id
app.get("/posts/creator/:_id", getPostsByCreatorId);
// Get all posts a user is joining
app.get("/posts/joiner/:_id", getPostsByJoinerId);
// Post a new activity
app.post("/posts/add", postNewActivityPost);
// Delete an existing post
app.delete("/posts/delete/:_id", deletePostById);
// Get post by it's unique _id
app.get("/posts/:_id", getPostById);

// Handle current user joining or withdrawing from an activity
app.put("/post/updateJoining", putjoinByUserId);

// Get current user session from express-session
app.get("/get-login-session", getLoginSession);
// add current user data to express-session when the user logs in
app.post("/add-login-session", postLoginSession);
// delate current user data when the user logs out
app.delete("/delete-login-session", deleteLoginSession);

var server = app.listen(PORT, function () {
  console.info("🌍 Listening on port " + PORT);
});

const io = socketIo(server, {
  cors: {
    origin: [frontUrl],
  },
});

io.on("connection", (socket) => chatSocket(io, socket));
