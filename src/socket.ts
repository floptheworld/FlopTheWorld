import { Server } from "http";
import { listen } from "socket.io";
import { games } from "./common/const";
import { Game } from "./common/game/game";

import getGames from "./socket-routes/get-games";
import subscribeToGame from "./socket-routes/subscribe-to-game";
import startGame from "./socket-routes/start-game";
import playerAction from "./socket-routes/player-action";
import leaveGame from "./socket-routes/leave-game";
import callClock from "./socket-routes/call-clock";
import message from "./socket-routes/message";
import connectUser from "./socket-routes/connect-user";

games.push(new Game("asdf1234", "Game1", 0.1, 0.05, "gray_back"));
games.push(new Game("asdf12345", "Game2", 0.05, 0.02, "gray_back"));

export function createSocket(server: Server) {
  const io = listen(server);

  io.on("connection", (socket) => {
    subscribeToGame(io, socket);

    startGame(io, socket);

    playerAction(io, socket);

    leaveGame(io, socket);

    callClock(io, socket);

    message(io, socket);

    getGames(socket);

    connectUser(socket);
  });
}
