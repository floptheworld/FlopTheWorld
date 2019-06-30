import { GameType, GameState } from "../types";
import { getGameStatePlayers } from "../player/get-game-state-players";

export function getGameState(
  currentGame: GameType,
  playerID: string
): GameState {
  return {
    ...{
      board: currentGame.board,
      gameID: currentGame.gameID,
      players: getGameStatePlayers(
        currentGame.players,
        playerID,
        currentGame.cardBack
      ),
      pot: currentGame.pot,
      round: currentGame.round,
      bigBlind: currentGame.bigBlind,
      littleBlind: currentGame.littleBlind,
      currentBet: currentGame.currentBet,
      currentPot: currentGame.currentPot,
      currentPlayerID: playerID,
      cardBack: currentGame.cardBack,
      winDesc: currentGame.winDesc,
      pots: currentGame.pots,
    },
  };
}
