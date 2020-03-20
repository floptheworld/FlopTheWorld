import { getGameRepository } from "../db/db";
import { GameType } from "../common/types";

export default (socket: SocketIO.Socket) => {
  socket.on("getGames", async (sendGames: (games: GameType[]) => void) => {
    sendGames(await getGameRepository().find({ relations: ["players"] }));
  });
};
