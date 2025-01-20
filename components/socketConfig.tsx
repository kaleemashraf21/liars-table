const {io} = require("socket.io-client");

const connectionOptions = { transports: ["websocket"], autoConnect: false };
export const Socket = io("http://172.21.88.100:8080", connectionOptions); // replace ip address
// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";
// export const socket = io(URL, {
//   autoConnect: false,
//   transports: ["websocket", "polling"],
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
