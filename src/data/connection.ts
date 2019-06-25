import io from "socket.io-client";
import { GameState } from "../common/types";

export async function createConnection(
  setState: (state: GameState) => void
): Promise<SocketIOClient.Socket> {
  const socket = io();

  socket.emit("subscribeToGame", "asdf1234");
  socket.emit("gameStart", "asdf1234");

  socket.on("gameUpdate", (state: GameState) => {
    setState(state);
  });

  return socket;
}
