import io from "socket.io-client";

export function createConnection() {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("join", "Hello World from client");
  });

  // socket.on("message", (message: string) => {
  //   console.log(message);
  // });

  return socket;
}
