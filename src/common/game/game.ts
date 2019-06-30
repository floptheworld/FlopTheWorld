import { GameType, PlayerType, GameState } from "../types";
import { shuffleDeck } from "../shuffle-deck";
import { createDeck } from "../create-deck";
import { nextRound } from "./next-round";
import { nextPlayerTurn } from "../player/next-player-turn";

export class Game implements GameType {
  public gameID: string = "asdf1234";
  public players: PlayerType[] = [];
  public board: string[] = [];
  public round: number = 0;
  public pot: number = 0;
  public bigBlind: number = 0.1;
  public littleBlind: number = 0.05;
  public currentBet: number = 0;
  public currentPot: number = 0;
  public currentPlayerID: string = "";
  public cardBack: string = "gray_back";
  public winDesc: string = "";
  public pots: number[] = [];
  public deck: string[] = [];

  constructor() {}

  get dealerIndex(): number {
    return this.players.findIndex((player) => player.dealer === true);
  }

  get littleBlindIndex(): number {
    return this.players.findIndex((player) => player.isLittleBlind === true);
  }

  get bigBlindIndex(): number {
    return this.players.findIndex((player) => player.isBigBlind === true);
  }

  get isTurnIndex(): number {
    return this.players.findIndex((player) => player.isTurn === true);
  }

  get activePlayers(): PlayerType[] {
    return this.players.filter((player) => player.status !== "fold");
  }

  get gameState(): GameState {
    return {
      board: this.board,
      gameID: this.gameID,
      players: [],
      pot: this.pot,
      round: this.round,
      bigBlind: this.bigBlind,
      littleBlind: this.littleBlind,
      currentBet: this.currentBet,
      currentPot: this.currentPot,
      currentPlayerID: "",
      cardBack: this.cardBack,
      winDesc: this.winDesc,
      pots: this.pots,
    };
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

    this.currentBet = this.bigBlind;
    this.currentPot = this.bigBlind + this.littleBlind;
  }

  public updatePot(): void {
    this.players
      .filter((player) => player.bet !== "")
      .map((player) => (this.pot = this.pot + parseFloat(player.bet)));
  }

  public updateRound(): void {
    nextRound(this);
  }

  public addPlayer(player: PlayerType): void {
    this.players.push(player);
  }

  public clearActivePlayers(): void {
    this.players.map((player) => {
      player.bet = "";
      if (player.status !== "fold") {
        player.status = "";
      }
    });
  }

  public findPlayerByID(userID: string): PlayerType | undefined {
    return this.players.find((player) => player.playerID === userID);
  }

  public playerAction(player: PlayerType, action: string, data: string): void {
    const dataNum = parseFloat(data);

    if (data !== "" && isNaN(dataNum)) {
      return;
    }

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
        this.currentBet = dataNum;
        player.subtractBet(this.currentBet);
        this.currentPot += this.currentBet - (parseFloat(player.bet) || 0);
        player.bet = parseFloat(data).toFixed(2);
        break;
      default:
        break;
    }

    player.status = action;

    this.nextTurn();
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

  private clearPlayers(): void {
    this.players.map((player) => {
      player.bet = "";
      player.status = "";
    });
  }

  private newDeck(): string[] {
    return shuffleDeck(createDeck());
  }

  private deal() {
    this.players.map((player) => {
      if (player.cards.length < 2) {
        player.cards.push(this.deck!.pop()!);
      }
    });

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
  }

  private nextTurn(): void {
    nextPlayerTurn(this);
  }
}
