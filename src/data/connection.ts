import io from "socket.io-client";
import { GameState } from "../common/types";

export async function createConnection(
  setState: (state: GameState) => void
): Promise<SocketIOClient.Socket> {
  const socket = io("http://localhost:8080", {
    transports: ["websocket"],
    upgrade: false,
  });

  socket.emit(
    "findOrCreateUser",
    localStorage.userID || "",
    (userID: string) => {
      localStorage.userID = userID;

      socket.emit("subscribeToGame", "asdf1234", localStorage.userID);
      socket.emit("gameStart", "asdf1234");

      socket.on("gameUpdate", (state: GameState) => {
        setState(state);
      });
    }
  );

  return socket;
}
