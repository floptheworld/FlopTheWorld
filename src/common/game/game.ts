import { PlayerType, GameState } from "../types";
import { GamePlay } from "./game-play";

export class Game extends GamePlay {
  constructor(
    gameID: string,
    bigBlind: number,
    littleBlind: number,
    cardBack: string
  ) {
    super(gameID, bigBlind, littleBlind, cardBack);
  }

  public getGameState(currentPlayerID: string): GameState {
    return {
      board: this.board,
      gameID: this.gameID,
      players: this.isGameOver
        ? this.players
        : this.getGameStatePlayers(currentPlayerID),
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
      isGameOver: this.isGameOver,
      isStarted: this.isStarted,
      sittingInPlayers: this.sittingInPlayers,
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

  public removePlayer(removePlayer: PlayerType): void {
    this.players.splice(
      this.players.findIndex((player) => player === removePlayer),
      1
    );
  }

  public findPlayerByID(userID: string): PlayerType | undefined {
    return this.players.find((player) => player.playerID === userID);
  }

  public playerAction(player: PlayerType, action: string, data: string): void {
    const dataNum = parseFloat(data);

    if (data !== "" && isNaN(dataNum)) {
      return;
    }

    this.actionPlayed(player, action, dataNum);
  }
}
