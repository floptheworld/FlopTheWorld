import uuid from "uuid";
import { Server } from "http";
import { listen } from "socket.io";
import { GameType, PlayerType } from "./common/types";
import { getGame } from "./common/get-game";
import { games, users } from "./common/const";
import { getUser } from "./common/get-user";
import { Player } from "./common/player/player";
import { Game } from "./common/game/game";

games.push(new Game("asdf1234", 0.1, 0.05, "gray_back"));

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

      sendGameState(io, game);
    });

    socket.on("startGame", (gameID: string) => {
      const game = getGame(gameID);

      game.start();
      sendGameState(io, game);
    });

    socket.on(
      "playerAction",
      (gameID: string, userID: string, action: string, data: string) => {
        const game = getGame(gameID);
        const player: PlayerType = game.findPlayerByID(userID)!;

        if (
          (!player || !player.isTurn) &&
          action !== "rebuy" &&
          action !== "toggleSitOut"
        ) {
          return;
        }

        game.playerAction(player, action, data);
        sendGameState(io, game);

        // Game has ended, show last cards and winning desc then wait 5 secs and start a new game
        if (game.winDesc !== "") {
          setTimeout(() => {
            game.start();
            sendGameState(io, game);
          }, 5000);
        }
      }
    );
  });
}

function sendGameState(io: SocketIO.Server, game: GameType): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map((client: string) => {
      io.to(client).emit(
        "gameUpdate",
        game.getGameState(
          users.find((user) => user.clientID === client)!.userID
        )
      );
    });
  });
}
