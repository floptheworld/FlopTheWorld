import { Server } from "http";
import { listen, Client } from "socket.io";
import {
  addPlayer,
  createGame,
  getGame,
  getGameState,
  nextRound,
  startGame,
  playerAction,
  nextPlayerTurn,
  isPlayerAction,
} from "./common/public-api";
import { Game, Player } from "./common/types";

const games: Game[] = [];
games.push(createGame());

export function createSocket(server: Server) {
  const io = listen(server);
  io.on("connection", (socket) => {
    // tslint:disable-next-line:no-console
    console.log("Client connected..");

    socket.on("subscribeToGame", (gameID: string) => {
      // tslint:disable-next-line:no-console
      console.log(`client is subscribing the game: ${gameID} @ ${socket.id}`);
      socket.join(gameID);

      const currentGame = getGame(games, gameID);

      if (
        !currentGame.players.find((player) => player.playerID === socket.id)
      ) {
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

    socket.on(
      "playerAction",
      (gameID: string, action: string, data: string) => {
        const currentGame = getGame(games, gameID);
        const player: Player = isPlayerAction(currentGame, socket.id);
        if (!player) {
          return;
        }

        playerAction(currentGame, player, action, data);
        nextPlayerTurn(currentGame);
        updateGameState(io, currentGame);
      }
    );
  });
}

function updateGameState(io: SocketIO.Server, game: Game): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map((client: string) => {
      io.to(client).emit("gameUpdate", getGameState(game, client));
    });
  });
}
