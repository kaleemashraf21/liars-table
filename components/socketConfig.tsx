const { io } = require("socket.io-client");

const connectionOptions = {
  transports: ["websocket", "polling"],
  autoConnect: false,
};
export const Socket = io("https://liars-table-be.onrender.com", connectionOptions); // replace ip address

// http://172.21.88.100
// http://192.168.0.19:8080
// const port = process.env.PORT || 8080;
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

Socket.connect();

Socket.on("connect", () => {
  console.log("Socket connected successfully", Socket.id);
});

Socket.on("connect_error", (error: any) => {
  console.log("Socket connection error:", error);
});

Socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";
// export const socket = io(URL, {
//   autoConnect: false,
//   transports: ["websocket", "polling"],
// });
