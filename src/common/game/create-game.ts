import { GameType } from "../types";

export function createGame(): GameType {
  return {
    board: [],
    deck: [],
    gameID: "asdf1234",
    // gameID: uuid(),
    players: [],
    pot: 0,
    round: 0,
    currentBet: 0,
    currentPot: 0,
    bigBlind: 0.1,
    littleBlind: 0.05,
    currentPlayerID: "",
    cardBack: "gray_back",
    winDesc: "",
    pots: [],
  };
}
