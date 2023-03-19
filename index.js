//import express 和 ws 套件
import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

//指定開啟的 port
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/hands/:file", async (req, res) => {
  console.log(123);
  res.sendFile(`${__dirname}/public/hands/${req.params.file}`);
});

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

//當 WebSocket 從外部連結時執行
io.on("connection", (socket) => {
  socket.on("detectHand", (data) => {
    io.emit("re-detectHand", data);
  });
  socket.on("groundVideo", (data) => {
    console.log(data);
    io.emit("re-groundVideo", data);
  });
  socket.on("route", (data) => {
    console.log(data);
    io.emit("re-route", data);
  });
  socket.on("hitRocket", (data) => {
    console.log(data);
    io.emit("re-hitRocket", data);
  });
});

httpServer.listen(PORT, () => {
  console.log("Server is runing at 127.0.0.1 : " + PORT);
});
