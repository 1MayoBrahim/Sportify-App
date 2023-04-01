const { MongoClient } = require("mongodb");
const { getMessages } = require("./handlers/getMessages");
const { sendMessage } = require("./handlers/sendMessage");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const chatSocket = async (io, socket) => {
  const client = new MongoClient(MONGO_URI, options);
  const room = socket.handshake.query.activityId;
  console.log("---------------------");

  await client.connect();

  console.log("MongoClient connected");
  console.log("New client connected: ", socket.id);

  await socket.join(room);
  console.log("Client joined ", room);

  await socket.on("send-message", async (message) => {
    await sendMessage(client, message, room);
    await getMessages(client, io, room);
  });

  await socket.on("disconnect", () => {
    client.close();
    console.log("MongoClient disconnected");
    console.log("Client Left ", room);
    console.log("Client disconnected", socket.id);
  });

  getMessages(client, io, room);
};

module.exports = { chatSocket };
