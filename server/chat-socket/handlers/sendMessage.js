const sendMessages = async (client, message, room) => {
  const db = client.db("Sportify");
  const query = { _id: room };
  const addMessage = { $push: { message: { ...message } } };

  await db.collection("posts").updateOne(query, addMessage);
};

module.exports = { sendMessages };
