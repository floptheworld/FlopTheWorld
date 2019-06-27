import { Game } from "../types";
import { clearActivePlayers } from "../player/clear-active-players";
import { updatePot } from "./update-pot";
import { solveHands } from "./solve-hands";

export function nextRound(game: Game) {
  game.round++;
  game.currentBet = 0;
  game.currentPot = 0;
  updatePot(game);
  clearActivePlayers(game);
  switch (game.round) {
    case 1:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    case 2:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    case 3:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    default:
      solveHands(game);
    // startGame(game);
  }
}
