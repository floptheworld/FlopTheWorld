import io from "socket.io-client";
import { GameState, User } from "../common/types";

export async function createConnection(
  setState: (state: GameState) => void
): Promise<SocketIOClient.Socket> {
  const socket = io("http://localhost:8080");

  socket.on("gameUpdate", (state: GameState) => {
    setState(state);
  });

  if (localStorage.playerID && localStorage.name) {
    findOrCreatePlayer(socket, localStorage.name, localStorage.playerID);
  }

  return socket;
}

export function findOrCreatePlayer(
  socket: SocketIOClient.Socket,
  playerName: string,
  playerID: string = ""
) {
  socket.emit("findOrCreatePlayer", playerID, playerName, (player: User) => {
    localStorage.playerID = player.userID;
    localStorage.name = player.userName;

    socket.emit("subscribeToGame", "asdf1234", localStorage.playerID);
    socket.emit("gameStart", "asdf1234");
  });
}

export function sendPlayerAction(
  socket: SocketIOClient.Socket,
  gameID: string,
  action: string,
  amount: string
) {
  socket.emit("playerAction", gameID, localStorage.playerID, action, amount);
}

export function startGame(socket: SocketIOClient.Socket, gameID: string) {
  socket.emit("startGame", gameID);
}
