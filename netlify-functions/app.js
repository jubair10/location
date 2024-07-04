const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const port = 80 ;
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {

    io.emit("receive-location", {id:socket.id, ...data})
  });
  console.log("Connected");
  socket.on("disconnect",()=>{
    io.emit("user-disconnected",socket.id)
  })
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(port, () => {
  console.log("Listening on http://localhost:80");
});
