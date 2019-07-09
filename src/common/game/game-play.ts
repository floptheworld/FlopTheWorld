import { PlayerType, GamePlayType } from "../types";
import { shuffleDeck } from "../shuffle-deck";
import { createDeck } from "../create-deck";
import { nextTurn } from "./next-turn";
import { solveHands } from "./solve-hands";
import { updatePots } from "./update-pots";

export class GamePlay implements GamePlayType {
  public players: PlayerType[] = [];
  public board: string[] = [];
  public pots: number[] = [];
  public deck: string[] = [];
  public currentPlayerID: string = "";
  public winDesc: string = "";
  public cardBack: string;
  public gameID: string;
  public currentBet: number = 0;
  public currentPot: number = 0;
  public round: number = 0;
  public pot: number = 0;
  public littleBlind: number;
  public bigBlind: number;
  public isGameOver: boolean = false;
  public isStarted: boolean = false;
  public isOpen: boolean = false;
  public showWinningDescription: boolean = false;
  public timer?: number;

  get dealerIndex(): number {
    return this.players.findIndex((player) => player.dealer === true);
  }

  get littleBlindIndex(): number {
    return this.players.findIndex((player) => player.isLittleBlind === true);
  }

  get bigBlindIndex(): number {
    return this.players.findIndex((player) => player.isBigBlind === true);
  }

  get playerTurnIndex(): number {
    return this.players.findIndex((player) => player.isTurn === true);
  }

  get activePlayers(): PlayerType[] {
    return this.players.filter((player) => player.isActive === true);
  }

  get sittingInPlayers(): PlayerType[] {
    return this.players.filter((player) => player.isSittingOut !== true);
  }

  constructor(
    gameID: string,
    bigBlind: number,
    littleBlind: number,
    cardBack: string
  ) {
    this.gameID = gameID;
    this.bigBlind = bigBlind;
    this.littleBlind = littleBlind;
    this.cardBack = cardBack;
  }

  public start(): void {
    this.cleanTable();
    this.clearPlayers();
    this.updateBuyIn();
    this.updateSitting();

    if (this.sittingInPlayers.length < 2) {
      this.isStarted = false;
      return;
    }

    this.newDeck();
    this.updateDealer();
    this.updateBlinds();
    this.deal();

    let nextTurnIndex = this.bigBlindIndex + 1;

    while (
      !this.players[nextTurnIndex] ||
      this.players[nextTurnIndex].isSittingOut
    ) {
      if (!this.players[nextTurnIndex]) {
        nextTurnIndex = 0;
      } else {
        nextTurnIndex++;
      }
    }

    this.players[nextTurnIndex].isTurn = true;

    this.isStarted = true;
  }

  public solveHands(): void {
    solveHands(this);
  }

  public actionPlayed(player: PlayerType, action: string, data: number): void {
    switch (action) {
      case "fold":
        player.cards = [];
        break;
      case "check":
        break;
      case "call":
        const bet =
          this.currentBet > player.stackAmount + parseFloat(player.bet)
            ? player.stackAmount
            : this.currentBet;

        player.subtractBet(bet);
        this.currentPot += bet - (parseFloat(player.bet) || 0);
        player.bet = bet.toFixed(2);
        break;
      case "bet":
      case "raise":
        this.currentBet = data;
        player.subtractBet(this.currentBet);

        this.currentPot += this.currentBet - (parseFloat(player.bet) || 0);
        player.bet = data.toFixed(2);

        this.clearLastAggresor();
        player.isLastAggressor = true;
        break;
      case "rebuy":
        player.pendingBuyIn = data || 0;
        if (!this.isStarted) {
          this.updateBuyIn();
        }
        return;
      case "toggleSitOut":
        player.pendingSitOut = !player.pendingSitOut;
        if (!this.isStarted) {
          this.updateSitting();
        }
        return;
      default:
        break;
    }

    player.status = action;
    this.nextTurn();
  }

  public updateRound(): void {
    this.round++;
    this.currentBet = 0;
    this.currentPot = 0;
    this.updatePot();
    this.clearPlayers(true);

    switch (this.round) {
      case 1:
        this.deck!.pop();
        this.board.push(this.deck!.pop()!);
        this.deck!.pop();
        this.board.push(this.deck!.pop()!);
        this.deck!.pop();
        this.board.push(this.deck!.pop()!);
        break;
      case 2:
        this.deck!.pop();
        this.board.push(this.deck!.pop()!);
        break;
      case 3:
        this.deck!.pop();
        this.board.push(this.deck!.pop()!);
        break;
      default:
        this.isGameOver = true;
        break;
    }
  }

  public updatePlayerStacks(): void {
    this.activePlayers.map(
      (activePlayer) => (activePlayer.stackAmount += activePlayer.result)
    );
  }

  private nextTurn(): void {
    if (this.activePlayers.length === 1) {
      this.isGameOver = true;
      return;
    }

    nextTurn(this);
  }

  private cleanTable(): void {
    this.players.map((player) => {
      player.cleanPlayer();
    });

    this.board = [];
    this.deck = [];
    this.pots = [];
    this.round = 0;
    this.pot = 0;
    this.winDesc = "";
    this.isGameOver = false;
    this.isOpen = false;
    this.showWinningDescription = false;
  }

  private clearPlayers(active: boolean = false): void {
    this.players.map((player) => {
      player.bet = "";
      if (active && !player.isActive) {
        return;
      }
      player.status = "";
    });
  }

  private newDeck(): void {
    this.deck = shuffleDeck(createDeck());
  }

  private deal(): void {
    // Deal First Card
    this.sittingInPlayers.map((player) => {
      if (player.cards.length < 2) {
        player.cards.push(this.deck!.pop()!);
      }
    });

    // Deal Second Card
    this.sittingInPlayers.map((player) => {
      if (player.cards.length < 2) {
        player.cards.push(this.deck!.pop()!);
      }
    });
  }

  private updateDealer(): void {
    if (this.dealerIndex === -1) {
      this.sittingInPlayers[0].dealer = true;
      return;
    }

    let nextDealerIndex = this.dealerIndex + 1;

    while (
      !this.players[nextDealerIndex] ||
      this.players[nextDealerIndex].isSittingOut
    ) {
      if (!this.players[nextDealerIndex]) {
        nextDealerIndex = 0;
      } else {
        nextDealerIndex++;
      }
    }

    this.players[this.dealerIndex].dealer = false;
    this.players[nextDealerIndex].dealer = true;
  }

  private updateBlinds(): void {
    let nextLittleBlindIndex = this.dealerIndex + 1;

    while (
      !this.players[nextLittleBlindIndex] ||
      this.players[nextLittleBlindIndex].isSittingOut
    ) {
      if (!this.players[nextLittleBlindIndex]) {
        nextLittleBlindIndex = 0;
      } else {
        nextLittleBlindIndex++;
      }
    }

    this.players[nextLittleBlindIndex].setLittleBlind(this.littleBlind);

    let nextBigBlindIndex = this.littleBlindIndex + 1;

    while (
      !this.players[nextBigBlindIndex] ||
      this.players[nextBigBlindIndex].isSittingOut
    ) {
      if (!this.players[nextBigBlindIndex]) {
        nextBigBlindIndex = 0;
      } else {
        nextBigBlindIndex++;
      }
    }

    this.players[nextBigBlindIndex].setBigBlind(this.bigBlind);

    this.currentBet = this.bigBlind;
    this.currentPot = this.bigBlind + this.littleBlind;
  }

  private updatePot(): void {
    updatePots(this);
  }

  private updateSitting(): void {
    this.players
      .filter((player) => player.pendingSitOut || player.stackAmount === 0)
      .map((player) => (player.isSittingOut = true));

    this.players
      .filter(
        (player) =>
          !player.pendingSitOut && player.isSittingOut && player.stackAmount > 0
      )
      .map((player) => (player.isSittingOut = false));
  }

  private updateBuyIn(): void {
    this.players.map((player) => {
      player.stackAmount += player.pendingBuyIn || 0;
      player.pendingBuyIn = 0;
    });
  }

  private clearLastAggresor(): void {
    this.players.map((player) => (player.isLastAggressor = false));
  }
}
