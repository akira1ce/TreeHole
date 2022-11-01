const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: true });

const port = process.env.PORT || 3000;

app.use(require("express").static(__dirname + "/public"));

app.get("/a", (req, res) => {
  res.sendFile(__dirname + "/a.html");
});

app.get("/b", (req, res) => {
  res.sendFile(__dirname + "/b.html");
});

app.get("/vue", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

io.on("connection", (socket) => {
  console.log('connection');
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
