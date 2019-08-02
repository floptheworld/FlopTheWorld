import { getGame } from "../common/get-game";
import { getUser } from "../common/get-user";
import { Player } from "../common/player/player";
import { sendGameState } from "../send-game-state";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("subscribeToGame", (gameID: string, userID: string) => {
    // tslint:disable-next-line:no-console
    console.log(`client is subscribing the game: ${gameID} @ ${userID}`);

    // Join socket to gameID room
    socket.join(gameID);

    const game = getGame(gameID);
    const user = getUser(userID);

    // If the game doesn't have this user already added
    if (!game.findPlayerByID(userID)) {
      game.addPlayer(new Player(userID, user.userName));
    }

    // Update Game State for all clients
    sendGameState(io, game);
  });
};
