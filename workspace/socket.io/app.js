const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: true });

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("socket connection");
  socket.on("sendMessage", (msg) => {
    io.emit("sendMessage", msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
