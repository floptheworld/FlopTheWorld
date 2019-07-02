export interface PlayerState {
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
  isSittingOut: boolean;
  pendingSitOut: boolean;
  readonly isActive: boolean;
  readonly isCheck: boolean;
  readonly numBet: number;
}

export interface PlayerType extends PlayerState {
  setLittleBlind(num: number): void;
  setBigBlind(num: number): void;
  subtractBet(num: number): void;
  cleanPlayer(): void;
}

export interface GameState {
  gameID: string;
  players: PlayerState[];
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
  isStarted: boolean;
  isGameOver: boolean;
  isOpen: boolean;
  readonly sittingInPlayers: PlayerType[];
}

export interface GamePlayType extends GameState {
  deck: string[];
  players: PlayerType[];
  readonly dealerIndex: number;
  readonly littleBlindIndex: number;
  readonly bigBlindIndex: number;
  readonly playerTurnIndex: number;
  readonly activePlayers: PlayerType[];
  solveHands(): void;
  start(): void;
  updateRound(): void;
}

export interface GameType extends GamePlayType {
  getGameState(currentPlayerID: string): GameState;
  addPlayer(player: PlayerType): void;
  findPlayerByID(userID: string): PlayerType | undefined;
  playerAction(player: PlayerType, action: string, data: string): void;
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
