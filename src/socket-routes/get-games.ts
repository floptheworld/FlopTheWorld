import { Game } from "../common/game/game";
import { games } from "../common/const";

export default (socket: SocketIO.Socket) => {
  socket.on("getGames", (sendGames: (games: Game[]) => void) => {
    sendGames(games);
  });
};
