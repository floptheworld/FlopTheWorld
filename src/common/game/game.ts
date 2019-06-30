import { PlayerType, GameState } from "../types";
import { GamePlay } from "./game-play";

export class Game extends GamePlay {
  constructor() {
    super();
  }

  public getGameState(currentPlayerID: string): GameState {
    return {
      board: this.board,
      gameID: this.gameID,
      players: this.getGameStatePlayers(currentPlayerID),
      pot: this.pot,
      round: this.round,
      bigBlind: this.bigBlind,
      littleBlind: this.littleBlind,
      currentBet: this.currentBet,
      currentPot: this.currentPot,
      currentPlayerID,
      cardBack: this.cardBack,
      winDesc: this.winDesc,
      pots: this.pots,
    };
  }

  public getGameStatePlayers(currentPlayerID: string): PlayerType[] {
    const copyPlayers = this.players.map((player) => ({ ...player }));

    copyPlayers
      .filter(
        (player) =>
          player.playerID !== currentPlayerID && player.cards.length > 0
      )
      .map((player) => {
        player.cards = [this.cardBack, this.cardBack];
      });

    return copyPlayers;
  }

  public addPlayer(player: PlayerType): void {
    this.players.push(player);
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
}
