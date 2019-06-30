import { PlayerType, GamePlayType } from "../types";
import { shuffleDeck } from "../shuffle-deck";
import { createDeck } from "../create-deck";
import { nextPlayerTurn } from "../player/next-player-turn";
import { solveHands } from "./solve-hands";
import { updatePots } from "./update-pots";

export class GamePlay implements GamePlayType {
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

  public solveHands(): void {
    solveHands(this);
  }

  public updateRound(): void {
    this.round++;
    this.currentBet = 0;
    this.currentPot = 0;
    this.updatePot();
    this.clearActivePlayers();

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

  protected cleanTable(): void {
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

  protected clearPlayers(): void {
    this.players.map((player) => {
      player.bet = "";
      player.status = "";
    });
  }

  protected newDeck(): void {
    this.deck = shuffleDeck(createDeck());
  }

  protected deal() {
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

  protected updateDealer(): void {
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

  protected updateBlinds(): void {
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

  protected nextTurn(): void {
    nextPlayerTurn(this);
  }

  private updatePot(): void {
    this.players
      .filter((player) => player.bet !== "")
      .map((player) => (this.pot = this.pot + parseFloat(player.bet)));
  }

  private clearActivePlayers(): void {
    this.players.map((player) => {
      player.bet = "";
      if (player.status !== "fold") {
        player.status = "";
      }
    });
  }
}
