import { PlayerType, GamePlayType } from "../types";
import { shuffleDeck } from "../shuffle-deck";
import { createDeck } from "../create-deck";
import { nextPlayerTurn } from "./next-turn";
import { solveHands } from "./solve-hands";
import { updatePots } from "./update-pots";

export class GamePlay implements GamePlayType {
  public gameID: string;
  public cardBack: string;
  public bigBlind: number;
  public littleBlind: number;
  public players: PlayerType[] = [];
  public board: string[] = [];
  public round: number = 0;
  public pot: number = 0;
  public currentBet: number = 0;
  public currentPot: number = 0;
  public currentPlayerID: string = "";
  public winDesc: string = "";
  public pots: number[] = [];
  public deck: string[] = [];

  get dealerIndex(): number {
    return this.players.findIndex((player) => player.dealer === true);
  }

  get littleBlindIndex(): number {
    return this.players.findIndex((player) => player.isLittleBlind === true);
  }

  get bigBlindIndex(): number {
    return this.players.findIndex((player) => player.isBigBlind === true);
  }

  get activePlayers(): PlayerType[] {
    return this.players.filter((player) => player.status !== "fold");
  }

  get playerTurnIndex(): number {
    return this.players.findIndex((player) => player.isTurn === true);
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
    this.newDeck();
    this.deal();
    this.updateDealer();
    this.updateBlinds();

    if (this.players[this.bigBlindIndex + 1]) {
      this.players[this.bigBlindIndex + 1].isTurn = true;
    } else {
      this.players[0].isTurn = true;
    }
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
        player.subtractBet(this.currentBet);
        this.currentPot += this.currentBet - (parseFloat(player.bet) || 0);
        player.bet = this.currentBet.toFixed(2);
        break;
      case "bet":
      case "raise":
        this.currentBet = data;
        player.subtractBet(this.currentBet);
        this.currentPot += this.currentBet - (parseFloat(player.bet) || 0);
        player.bet = data.toFixed(2);
        break;
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
        this.solveHands();
        return;
    }

    updatePots(this);
  }

  private nextTurn(): void {
    if (this.activePlayers.length === 1) {
      this.activePlayers.map((player) => {
        player.stackAmount += this.pot + this.currentPot;
      });
      this.start();
      return;
    }

    nextPlayerTurn(this);
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

  private deal() {
    // Deal First Card
    this.players.map((player) => {
      if (player.cards.length < 2) {
        player.cards.push(this.deck!.pop()!);
      }
    });

    // Deal Second Card
    this.players.map((player) => {
      if (player.cards.length < 2) {
        player.cards.push(this.deck!.pop()!);
      }
    });
  }

  private updateDealer(): void {
    if (this.dealerIndex === -1) {
      this.players[0].dealer = true;
      return;
    }

    if (this.players[this.dealerIndex + 1]) {
      this.players[this.dealerIndex].dealer = false;
      this.players[this.dealerIndex + 1].dealer = true;
      return;
    }

    this.players[this.players.length - 1].dealer = false;
    this.players[0].dealer = true;
  }

  private updateBlinds(): void {
    if (this.players[this.dealerIndex + 1]) {
      this.players[this.dealerIndex + 1].setLittleBlind(this.littleBlind);
    } else {
      this.players[0].setLittleBlind(this.littleBlind);
    }

    if (this.players[this.littleBlindIndex + 1]) {
      this.players[this.littleBlindIndex + 1].setBigBlind(this.bigBlind);
    } else {
      this.players[this.littleBlindIndex + 1].setBigBlind(this.bigBlind);
    }

    this.currentBet = this.bigBlind;
    this.currentPot = this.bigBlind + this.littleBlind;
  }

  private updatePot(): void {
    this.players
      .filter((player) => player.bet !== "")
      .map((player) => (this.pot = this.pot + parseFloat(player.bet)));
  }
}
