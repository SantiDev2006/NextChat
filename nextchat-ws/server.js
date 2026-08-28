const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

const addUser = (userId, socketId)=>{
  if(!onlineUsers.some(user=>user.userId === userId)){
    onlineUsers.push({userId,socketId});
  }
}

const removeUser = socketId=>{
  onlineUsers = onlineUsers.filter(user=>user.socketId !== socketId);
}

io.on("connection", (socket)=>{
  console.log(`User Connected: ${socket.id}`);

  socket.on("add_new_user", userId=>{
    addUser(userId, socket.id);

    io.emit("get_online_users", onlineUsers)
  });

  //user opening a specific chat window
  socket.on("join_chat", (conversationID)=>{
    socket.join(conversationID);
    console.log(`User joined room: ${conversationID}`);
  });

  socket.on("send_message", (data)=>{
    // .to() sends it to everyone in the room EXCEPT the sender
    socket.to(data.room).emit("receive_message", data.message);
    console.log("message: ", data.message)
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("get_online_users", onlineUsers);
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});