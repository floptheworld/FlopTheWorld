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
      sendSound(io, game, "Beep.wav");
    });

    socket.on(
      "playerAction",
      (gameID: string, userID: string, action: string, data: string) => {
        const game: Game = getGame(gameID);
        const player: PlayerType = game.findPlayerByID(userID)!;

        if (
          (!player || !player.isTurn) &&
          action !== "rebuy" &&
          action !== "toggleSitOut"
        ) {
          return;
        }

        game.timer = undefined;
        game.playerAction(player, action, data, () => sendGameState(io, game));

        if (game.isStarted && game.playerTurnIndex !== -1) {
          sendSound(io, game, "Beep.wav");
        }
      }
    );

    socket.on("leaveGame", (gameID: string, userID: string) => {
      const game = getGame(gameID);
      const player: PlayerType = game.findPlayerByID(userID)!;

      game.removePlayer(player);
      socket.leave(gameID);
      users.splice(users.findIndex((user) => user.userID === userID), 1);

      sendGameState(io, game);
    });

    socket.on("callClock", (gameID: string) => {
      const game = getGame(gameID);
      game.timer = 15;

      sendGameState(io, game);
      const interval = setInterval(() => {
        if (game.timer === undefined) {
          clearInterval(interval);
          return;
        }

        if (game.timer === 0) {
          const player = game.players[game.playerTurnIndex];
          player.pendingSitOut = true;
          game.timer = undefined;

          clearInterval(interval);
          game.playerAction(player, "fold", "", () => sendGameState(io, game));
          return;
        }

        game.timer!--;
        sendGameState(io, game);
      }, 1000);
    });
  });
}

function sendGameState(io: SocketIO.Server, game: Game): void {
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

function sendSound(io: SocketIO.Server, game: Game, sound: string): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map((client: string) => {
      if (
        users.find((user) => user.clientID === client)!.userID ===
        game.players[game.playerTurnIndex].playerID
      ) {
        io.to(client).emit("sound", sound);
      }
    });
  });
}
