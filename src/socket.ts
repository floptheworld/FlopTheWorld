import { Server } from "http";
import { listen } from "socket.io";
import uuid = require("uuid");
import { Game, Player } from "./common/types";
import { createGame } from "./common/game/create-game";
import { getGame } from "./common/game/get-game";
import { addPlayer } from "./common/player/add-player";
import { startGame } from "./common/game/start-game";
import { isPlayerAction } from "./common/player/is-player-action";
import { playerAction } from "./common/player/player-action";
import { nextPlayerTurn } from "./common/player/next-player-turn";
import { getGameState } from "./common/game/get-game-state";
import { games, users } from "./common/const";

games.push(createGame());

export function createSocket(server: Server) {
  const io = listen(server);
  io.on("connection", (socket) => {
    // tslint:disable-next-line:no-console
    console.log("Client connected...");

    socket.on("findOrCreatePlayer", (userID: string, userName: string, fn) => {
      if (!users.find((user) => user.userID === userID)) {
        userID = uuid();
        users.push({ userID, clientID: socket.id, userName });
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

      fn(users.find((user) => user.userID === userID));
    });

    socket.on("subscribeToGame", (gameID: string, userID: string) => {
      // tslint:disable-next-line:no-console
      console.log(`client is subscribing the game: ${gameID} @ ${userID}`);
      socket.join(gameID);

      const currentGame = getGame(gameID);

      if (!currentGame.players.find((player) => player.playerID === userID)) {
        addPlayer(currentGame, userID);
      }

      updateGameState(io, currentGame);
    });

    socket.on("startGame", (gameID: string) => {
      const currentGame = getGame(gameID);

      startGame(currentGame);
      updateGameState(io, currentGame);
    });

    socket.on(
      "playerAction",
      (gameID: string, userID: string, action: string, data: string) => {
        const currentGame = getGame(gameID);
        const player: Player = isPlayerAction(currentGame, userID);
        if (!player) {
          return;
        }

        playerAction(currentGame, player, action, data);
        nextPlayerTurn(currentGame);
        updateGameState(io, currentGame);
        if (currentGame.winDesc !== "") {
          setTimeout(() => {
            startGame(currentGame);
            updateGameState(io, currentGame);
          }, 5000);
        }
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
