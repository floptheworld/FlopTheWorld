import { Server } from "http";
import { listen } from "socket.io";
import uuid = require("uuid");
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
import { Game, Player, User } from "./common/types";

const games: Game[] = [];
const users: User[] = [];
games.push(createGame());

export function createSocket(server: Server) {
  const io = listen(server);
  io.on("connection", (socket) => {
    // tslint:disable-next-line:no-console
    console.log("Client connected...");

    socket.on("findOrCreateUser", (userID: string, fn) => {
      if (!users.find((user) => user.userID === userID)) {
        userID = uuid();
        users.push({ userID, clientID: socket.id });
      } else {
        users
          .filter((user) => user.userID === userID)
          .map((user) => {
            try {
              io.sockets.sockets[user.clientID].disconnect();
            } catch (error) {
              // tslint:disable-next-line:no-console
              console.log(error);
            }
            user.clientID = socket.id;
          });
      }

      fn(userID);
    });

    socket.on("subscribeToGame", (gameID: string, userID: string) => {
      // tslint:disable-next-line:no-console
      console.log(`client is subscribing the game: ${gameID} @ ${userID}`);
      socket.join(gameID);

      const currentGame = getGame(games, gameID);

      if (!currentGame.players.find((player) => player.playerID === userID)) {
        addPlayer(currentGame, userID);
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
      (gameID: string, userID: string, action: string, data: string) => {
        const currentGame = getGame(games, gameID);
        const player: Player = isPlayerAction(currentGame, userID);
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
      io.to(client).emit(
        "gameUpdate",
        getGameState(
          game,
          users.find((user) => user.clientID === client)!.userID
        )
      );
    });
  });
}
