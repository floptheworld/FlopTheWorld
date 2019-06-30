import { Server } from "http";
import { listen } from "socket.io";
import uuid = require("uuid");
import { GameType, PlayerType } from "./common/types";
import { getGame } from "./common/game/get-game";
import { addPlayer } from "./common/player/add-player";
import { startGame } from "./common/game/start-game";
import { isPlayerAction } from "./common/player/is-player-action";
import { playerAction } from "./common/player/player-action";
import { nextPlayerTurn } from "./common/player/next-player-turn";
import { getGameState } from "./common/game/get-game-state";
import { games, users } from "./common/const";
import { Game } from "./common/game/game";
import { getUser } from "./common/getUser";
import { Player } from "./common/player/player";

games.push(new Game());

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

      const game = getGame(gameID);
      const user = getUser(userID);

      if (!game.findPlayerByID(userID)) {
        game.addPlayer(new Player(userID, user.userName));
      }

      updateGameState(io, game);
    });

    socket.on("startGame", (gameID: string) => {
      const game = getGame(gameID);

      game.start();
      updateGameState(io, game);
    });

    socket.on(
      "playerAction",
      (gameID: string, userID: string, action: string, data: string) => {
        const game = getGame(gameID);
        const player: PlayerType = game.findPlayerByID(userID)!;

        if (!player || !player.isTurn) {
          return;
        }

        game.playerAction(player, action, data);
        // nextPlayerTurn(game);
        updateGameState(io, game);
        if (game.winDesc !== "") {
          setTimeout(() => {
            game.start();
            updateGameState(io, game);
          }, 5000);
        }
      }
    );
  });
}

function updateGameState(io: SocketIO.Server, game: GameType): void {
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
