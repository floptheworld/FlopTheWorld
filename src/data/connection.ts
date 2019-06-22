import io from "socket.io-client";
import { Game } from "../common/types";

export async function createConnection(
  setState: (state: Game) => void
): Promise<SocketIOClient.Socket> {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("join", "Hello World from client");
  });

  socket.on("gameUpdate", (state: Game) => setState(state));
  socket.emit("subscribeToGame", 1000);

  return socket;
}
