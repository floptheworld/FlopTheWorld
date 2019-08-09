import uuid = require("uuid");

import { PlayerType, UserType, GameType } from "../common/types";
import { roundToPrecision } from "../common/round-to-precision";

export class Player implements PlayerType {
  public playerID!: string;
  public user!: UserType;
  public game!: GameType;
  public pendingBuyIn!: number;
  public stackAmount!: number;
  public invested!: number;
  public result!: number;
  public isTurn!: boolean;
  public isDealer!: boolean;
  public showCards!: boolean;
  public isBigBlind!: boolean;
  public isSittingOut!: boolean;
  public isSmallBlind!: boolean;
  public pendingSitOut!: boolean;
  public isLastAggressor!: boolean;
  public resultDesc: string = "";
  public status: string = "";
  public bet: string = "";
  public cards: string[] = [];
  public resultCards: string[] = [];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  get isActive(): boolean {
    return this.cards.length === 2 && this.status !== "fold";
  }

  get isCheck(): boolean {
    return this.status === "check";
  }

  get numBet(): number {
    return roundToPrecision(parseFloat(this.bet), 0.01);
  }

  constructor(stackAmount: number) {
    this.playerID = uuid();
    this.stackAmount = stackAmount;
  }

  public subtractBet(currentBet: number): void {
    const turnBet =
      roundToPrecision(currentBet, 0.01) -
      roundToPrecision(parseFloat(this.bet) || 0, 0.01);

    this.stackAmount = roundToPrecision(this.stackAmount, 0.01) - turnBet;
    this.invested = roundToPrecision(this.invested, 0.01) + turnBet;
  }

  public setBigBlind(blind: number): void {
    this.isBigBlind = true;
    const amount = this.stackAmount < blind ? this.stackAmount : blind;
    this.bet = amount.toFixed(2);
    this.stackAmount -= amount;
    this.invested += amount;
  }

  public setSmallBlind(blind: number): void {
    this.isSmallBlind = true;
    const amount = this.stackAmount < blind ? this.stackAmount : blind;
    this.bet = amount.toFixed(2);
    this.stackAmount -= amount;
    this.invested += amount;
  }

  public cleanPlayer(): void {
    this.cards = [];
    this.resultCards = [];
    this.isTurn = false;
    this.isBigBlind = false;
    this.isSmallBlind = false;
    this.isLastAggressor = false;
    this.showCards = false;
    this.invested = 0;
    this.result = 0;
    this.resultDesc = "";
  }
}
