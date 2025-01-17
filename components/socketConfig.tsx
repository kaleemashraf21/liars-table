const io = require("socket.io-client");

const connectionOptions = { transports: ["websocket"], autoConnect: false };
export const socket = io("http://192.168.0.19:8080", connectionOptions); // replace ip address
// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";
// export const socket = io(URL, {
//   autoConnect: false,
//   transports: ["websocket", "polling"],
// });

socket.connect();

socket.on("connect", () => {
  console.log("Socket connected successfully", socket.id);
});

socket.on("connect_error", (error: []) => {
  console.log("Socket connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});
