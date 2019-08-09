import { sendGameState } from "../send-game-state";
import { GameType, UserType, PlayerType } from "../common/types";
import { Player } from "../player/player";
import { getConnection } from "typeorm";
import { GameModel } from "../db/game-model";
import { UserModel } from "../db/user-model";
import { PlayerModel } from "../db/player-model";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("subscribeToGame", async (gameID: string, userID: string) => {
    // tslint:disable-next-line:no-console
    console.log(`client is subscribing the game: ${gameID} @ ${userID}`);
    const game: GameType | undefined = await getConnection()
      .getRepository(GameModel)
      .findOne(gameID, { relations: ["players", "players.user"] });

    const user: UserType | undefined = await getConnection()
      .getRepository(UserModel)
      .findOne(userID);

    if (!game || !user) {
      return;
    }

    user.clientID = socket.id;
    await getConnection()
      .getRepository(UserModel)
      .save(user);

    let player: PlayerType | undefined = await getConnection()
      .getRepository(PlayerModel)
      .findOne({
        game,
        user,
      });

    // If the game doesn't have this player already added add the player in db
    if (!player) {
      player = new Player(5.0);
      player.game = game;
      player.user = user;

      await getConnection()
        .getRepository(PlayerModel)
        .save(player);
    }

    socket.join(gameID);

    // Update Game State for all clients
    sendGameState(io, game);
  });
};
