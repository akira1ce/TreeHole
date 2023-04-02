/*
 * @Author: Akira
 * @Date: 2022-11-01 15:24:55
 * @LastEditTime: 2023-04-02 14:49:38
 */
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: true });

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.on("sendMessage", (msg) => {
    console.log(msg.senderID, ":", msg.data.content);
    io.emit("sendMessage", msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
