import { Server } from "http";
import { listen } from "socket.io";
import {
  addPlayer,
  createGame,
  getGame,
  getGameState,
  nextRound,
  startGame
} from "./common/public-api";
import { Game } from "./common/types";

const games: Game[] = [];
games.push(createGame());

export function createSocket(server: Server) {
  const io = listen(server);
  io.on("connection", socket => {
    // tslint:disable-next-line:no-console
    console.log("Client connected..");

    socket.on("subscribeToGame", (gameID: string) => {
      // tslint:disable-next-line:no-console
      console.log(`client is subscribing the game: ${gameID} @ ${socket.id}`);
      socket.join(gameID);

      const currentGame = getGame(games, gameID);

      if (!currentGame.players.find(player => player.playerID === socket.id)) {
        addPlayer(currentGame, socket.id);
      }

      updateGameState(io, currentGame);
    });

    socket.on("startGame", (gameID: string) => {
      const currentGame = getGame(games, gameID);

      startGame(currentGame);
      updateGameState(io, currentGame);
    });

    socket.on("nextRound", (gameID: string) => {
      const currentGame = getGame(games, gameID);

      nextRound(currentGame);
      updateGameState(io, currentGame);
    });

    socket.on("tet", (gameID: string) => {
      const currentGame = getGame(games, gameID);

      nextRound(currentGame);
      updateGameState(io, currentGame);
    });
  });
}

function updateGameState(io: SocketIO.Server, game: Game): void {
  io.sockets.in(game.gameID).emit("gameUpdate", getGameState(game));
}
