export interface PlayerState {
  playerID: string;
  user: UserType;
  game: GameType;
  cards: string[];
  stackAmount: number;
  isTurn: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isDealer: boolean;
  status: string;
  bet: string;
  invested: number;
  result: number;
  solvedHand?: Hand;
  isSittingOut: boolean;
  pendingSitOut: boolean;
  pendingBuyIn: number;
  isLastAggressor: boolean;
  showCards: boolean;
  resultCards: string[];
  resultDesc: string;
  readonly isActive: boolean;
  readonly isCheck: boolean;
  readonly numBet: number;
}

export interface PlayerType extends PlayerState {
  setSmallBlind(num: number): void;
  setBigBlind(num: number): void;
  subtractBet(num: number): void;
  cleanPlayer(): void;
}

export interface GameState {
  gameID: string;
  name: string;
  players: PlayerState[];
  board: string[];
  round: number;
  pot: number;
  bigBlind: number;
  smallBlind: number;
  currentBet: number;
  currentPot: number;
  currentPlayerID: string;
  cardBack: string;
  winDesc: string;
  pots: string[];
  isStarted: boolean;
  isGameOver: boolean;
  isOpen: boolean;
  timer?: number;
  handCount: number;
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
  // addPlayer(player: PlayerType): void;
  findPlayerByID(userID: string): PlayerType | undefined;
  playerAction(
    player: PlayerType,
    action: string,
    data: string,
    sendGameUpdate: () => void,
    sendMessage: (message: string) => void
  ): void;
}

export interface UserType {
  userID: string;
  userName: string;
  clientID?: string;
  email: string;
  password: string;
  name: string;
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

export interface GamePlayerUserClient {
  gameID: string;
  playerID: string;
  userID: string;
  clientID?: string;
}
