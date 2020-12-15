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
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/userName", (req, res) => {
  console.log(req.body);
  const userName = req.body.userName || null;
  if (userName === null) {
    res.status(400);
    res.send(false);
    return;
  }
  res.cookie("userName", userName, {
    // 设置该Cookie只可以由服务端访问，即前端JavaScript无法访问document.cookie获取该值，但控制台还是可以查看和修改
    httpOnly: true,
    // 只有通过HTTPS请求的Cookie才被使用，否则都认为是错误的Cookie
    // secure: true,
    // 设置保存Cookie的域名，浏览器查找Cookie时，子域名（如translate.google.com）可以访问主域名（google.com）下的Cookie，而主域名（google.com）不可以访问子域名（如translate.google.com）下的Cookie
    // 本地测试可直接设置为localhost
    domain: "localhost",
    // 设置保存Cookie的路径，浏览器查找Cookie时，子路径（如/map）可以访问根路径（'/'）下设置的Cookie，而根路径（'/'）无法访问子路径（如/map）下设置的Cookie
    path: "/",
    // 通过expires设置Cookie过期时间为14天后
    // expires: new Date(new Date().getTime() + 14 * 86400000),
    // 通过maxAge设置Cookie过期时间为14天后
    maxAge: 0.5 * 86400000,
  });
  res.send(true);
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
