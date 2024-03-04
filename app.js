const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const OrderingApp = require("./ordering");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/sender", (req, res) => {
  res.sendFile(path.join(__dirname + "/sender.html"));
});

app.get("/driver", (req, res) => {
  res.sendFile(path.join(__dirname + "/driver.html"));
});

const OrderingInstance = new OrderingApp();

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  socket.on("join", (user_type, Username) => {
    const userInfo = {
      socket: socket,
      user_type: user_type,
      name: Username,
    };

    OrderingInstance.joinSession(userInfo);
  });

  socket.on("requestOrder", (order) => {
    OrderingInstance.requestOrder(order);
  });

  socket.on("acceptOrder", (id, driverId) => {
    OrderingInstance.acceptOrder(id, driverId);
  });

  socket.on("rejectOrder", (id, driverId) => {
    OrderingInstance.rejectOrder(id, driverId);
  });

  socket.on("finishRide", (id, driverId) => {
    OrderingInstance.finishRide(id, driverId);
  });
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
