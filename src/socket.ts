import { Server } from "http";
import { listen } from "socket.io";

import getGames from "./socket-routes/get-games";
import subscribeToGame from "./socket-routes/subscribe-to-game";
import startGame from "./socket-routes/start-game";
import playerAction from "./socket-routes/player-action";
import leaveGame from "./socket-routes/leave-game";
import callClock from "./socket-routes/call-clock";
import message from "./socket-routes/message";
import connectUser from "./socket-routes/connect-user";

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
