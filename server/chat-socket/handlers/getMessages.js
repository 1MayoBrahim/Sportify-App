const getMessages = async (Client, io, room) => {
  const db = Client.db("Sportify");
  const query = { _id: room };
  const post = await db.collection("posts").find(query).toArray();
  if (post[0].messages) {
    io.in(room).emit("get-messages", post[0].messages);
  } else {
    io.in(room).emit("get-messages", []);
  }
};

module.exports = { getMessages };
