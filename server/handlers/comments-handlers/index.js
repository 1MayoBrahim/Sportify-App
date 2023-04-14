const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleAddComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("Sportify");
    const { userId, comment, activityId } = req.body;
    commentObject = { _id: uuidv4(), userId, comment, activityId };

    await db.collection("comments").insertOne(commentObject);
    res.status(200).json({ status: 200, message: "comment added" });
  } catch (err) {
    res.status(400).json({ status: 400, message: "comment not added" });
    client.close();
    console.log(err);
  }
};
const handleGetComments = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    const { activityId } = req.query;
    await client.connect();
    const db = client.db("Sportify");
    const allComments = await db.collection("comments").find().toArray();

    res.status(200).json({
      status: 200,
      data: allComments.filter((item) => item.activityId === activityId),
    });
  } catch (err) {
    res.status(404).json({ status: 404, message: "comments not found" });
    client.close();
    console.log(err);
  }
};
const handleUpdateComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    const { _id } = req.params;
    await client.connect();
    const db = client.db("Sportify");
    const newComment = { $set: { comment: req.body.comment } };
    await db.collection("comments").updateOne({ _id }, newComment);

    res.status(200).json({
      status: 200,
      message: "comment updated",
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: "comment not updated" });
    client.close();
    console.log(err);
  }
};
const handleDeleteComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    const { _id } = req.params;
    await client.connect();
    const db = client.db("Sportify");

    await db.collection("comments").deleteOne({ _id });

    res.status(200).json({
      status: 200,
      message: "comment deleted",
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: "comment not deleted" });
    client.close();
    console.log(err);
  }
};

module.exports = {
  handleGetComments,
  handleUpdateComment,
  handleDeleteComment,
  handleAddComment,
};
