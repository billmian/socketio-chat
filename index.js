var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var http = require("http").createServer(app);
var io = require("socket.io")(http);

// parse application/json ：接受 json 或者可以转换为json的数据格式

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/userName", (req, res) => {
  console.log(req.body);
  res.send("get");
  //   req.on("data", function (data) {
  //     obj = JSON.parse(data);
  //     console.log(obj);
  //     res.send("数据已接收");
  //   });
});

//在 index.html 引入 css 文件不成功，是因为没有设置 static 文件路径
app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    console.log("已连接用户", io.engine.clientsCount);
  });
  socket.on("newChatMessage", (msg) => {
    console.log("message: " + msg);
    io.emit("broadCastMessage", msg);
  });
  console.log("已连接用户", io.engine.clientsCount);
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
