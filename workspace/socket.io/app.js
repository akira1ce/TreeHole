/*
 * @Author: Akira
 * @Date: 2022-11-01 15:24:55
 * @LastEditTime: 2023-04-07 23:08:27
 */
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: true });

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.on("sendMessage", (content) => {
    console.log(`[${content.socketID}]`, content.senderID, ":", content.context);
    io.emit("sendMessage", content);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
