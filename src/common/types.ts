export interface PlayerType {
  name: string;
  cards: string[];
  playerID: string;
  stackAmount: number;
  isTurn: boolean;
  isLittleBlind: boolean;
  isBigBlind: boolean;
  dealer: boolean;
  status: string;
  bet: string;
  invested: number;
  result: number;
  solvedHand?: Hand;
  setLittleBlind(num: number): void;
  setBigBlind(num: number): void;
  subtractBet(num: number): void;
  cleanPlayer(): void;
}

export interface GameState {
  gameID: string;
  players: PlayerType[];
  board: string[];
  round: number;
  pot: number;
  bigBlind: number;
  littleBlind: number;
  currentBet: number;
  currentPot: number;
  currentPlayerID: string;
  cardBack: string;
  winDesc: string;
  pots: number[];
}

export interface GameType extends GameState {
  deck: string[];
}

export interface User {
  userID: string;
  userName: string;
  clientID: string;
}

export interface Card {
  wildValue: string;
  suit: string;
}

export interface Hand {
  cards: Card[];
  descr: string;
  rank: number;
  name: string;
  cardPool: Card[];
}
