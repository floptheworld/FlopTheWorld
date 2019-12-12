import { sendGameState } from "../send-game-state";
import { GameType, UserType, PlayerType } from "../common/types";
import { Player } from "../player/player";
import {
  getUserRepository,
  getGameRepository,
  getPlayerRepository,
} from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("subscribeToGame", async (gameID: string, userID: string) => {
    // tslint:disable-next-line:no-console
    console.log(`client is subscribing the game: ${gameID} @ ${userID}`);
    const game: GameType | undefined = await getGameRepository().findOne(
      gameID,
      { relations: ["players", "players.user"] }
    );

    const user: UserType | undefined = await getUserRepository().findOne(
      userID
    );

    if (!game || !user) {
      return;
    }

    user.clientID = socket.id;
    await getUserRepository().save(user);

    let player: PlayerType | undefined = await getPlayerRepository().findOne({
      game,
      user,
    });

    // If the game doesn't have this player already added add the player in db
    if (!player) {
      player = new Player(5.0);
      player.game = game;
      player.user = user;

      await getPlayerRepository().save(player);
    }

    socket.join(gameID);

    // Update Game State for all clients
    sendGameState(io, gameID);
  });
};
