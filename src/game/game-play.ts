import uuid = require("uuid");

import { PlayerType, GamePlayType } from "../common/types";
import { shuffleDeck } from "../common/shuffle-deck";
import { createDeck } from "../common/create-deck";
import { nextTurn } from "./next-turn";
import { solveHands } from "./solve-hands";
import { updatePots } from "./update-pots";

export class GamePlay implements GamePlayType {
  public gameID: string;
  public name: string = "";
  public round: number = 0;
  public currentBet: number = 0;
  public currentPot: number = 0;
  public pot: number = 0; // Add all Pots into here
  public smallBlind: number;
  public bigBlind: number;
  public isGameOver: boolean = false;
  public isStarted: boolean = false;
  public isOpen: boolean = false;
  public players!: PlayerType[];
  public cardBack: string;
  public currentPlayerID: string = ""; // Deprecate this
  public winDesc: string = "";
  public showWinningDescription: boolean = false;
  public timer?: number;
  public handCount: number = 0;
  public deck: string[] = [];
  public board: string[] = [];
  public pots: string[] = [];

  get dealerIndex(): number {
    return this.players.findIndex((player) => player.isDealer === true);
  }

  get littleBlindIndex(): number {
    return this.players.findIndex((player) => player.isSmallBlind === true);
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
    name: string,
    bigBlind: number,
    smallBlind: number,
    cardBack: string
  ) {
    this.gameID = uuid();
    this.name = name;
    this.bigBlind = bigBlind;
    this.smallBlind = smallBlind;
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

    this.handCount++;
    this.isStarted = true;
  }

  public solveHands(): void {
    solveHands(this);
  }

  public executePlayerAction(
    player: PlayerType,
    action: string,
    data: number
  ): void {
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
        if (!this.isStarted) {
          player.pendingSitOut = false;
          player.isSittingOut = !player.isSittingOut;
          return;
        }
        player.pendingSitOut = !player.pendingSitOut;
        return;
      default:
        break;
    }

    player.status = action;
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
        this.players.map((player) => (player.isTurn = false));
        this.isGameOver = true;
        break;
    }
  }

  public updatePlayerStacks(): void {
    this.activePlayers.map(
      (activePlayer) => (activePlayer.stackAmount += activePlayer.result)
    );
  }

  public nextTurn(): void {
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
      this.sittingInPlayers[0].isDealer = true;
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

    this.players[this.dealerIndex].isDealer = false;
    this.players[nextDealerIndex].isDealer = true;
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

    this.players[nextLittleBlindIndex].setSmallBlind(this.smallBlind);

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
    this.currentPot = this.bigBlind + this.smallBlind;
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
