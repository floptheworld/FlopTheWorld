import { sendGameState } from "../send-game-state";
import { GameType, UserType, PlayerType } from "../common/types";
import { Player } from "../player/player";
import {
  getUserRepository,
  getGameRepository,
  getPlayerRepository,
} from "../db/db";
import { updateAddGPCByGamePlayer } from "../common/game-player-client";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("subscribeToGame", async (gameID: string, userID: string) => {
    // tslint:disable-next-line:no-console
    console.log(
      `client is subscribing the game: ${gameID} @ ${userID} with Client ${socket.id}`
    );
    const game: GameType | undefined = await getGameRepository().findOne(
      gameID,
      { relations: ["players", "players.user"] }
    );

    if (!game) {
      return;
    }

    const user: UserType | undefined = await getUserRepository().findOne(
      userID
    );

    if (!user) {
      return;
    }

    user.clientID = socket.id;
    getUserRepository().save(user);

    let player: PlayerType | undefined = await getPlayerRepository().findOne({
      game,
      user,
    });

    // If the game doesn't have this player already added add the player in db
    if (!player) {
      player = new Player(5.0);
      player.game = game;
      player.user = user;

      getPlayerRepository().save(player);
      game.players.push(player);
    }

    updateAddGPCByGamePlayer(gameID, player.playerID, socket.id, userID);

    socket.join(gameID);

    // Update Game State for all clients
    sendGameState(io, game);
  });
};
