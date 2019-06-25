export interface Player {
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
}

export interface GameState {
  gameID: string;
  players: Player[];
  board: string[];
  round: number;
  pot: number;
  bigBlind: number;
  littleBlind: number;
  currentBet: number;
  currentPot: number;
  player: Player;
}

export interface Game extends GameState {
  deck: string[];
}
