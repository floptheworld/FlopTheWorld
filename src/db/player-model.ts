import {
  PrimaryColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { Player } from "../player/player";
import { UserModel } from "./user-model";
import { GameModel } from "./game-model";
import { getGameRepository } from "./db";

@Entity({ name: "player" })
@Unique(["user", "game"])
export class PlayerModel extends Player {
  @PrimaryColumn({ length: 64 })
  public playerID!: string;

  @Column({ length: 64 })
  public gameID!: string;

  @Column({ length: 64 })
  public userID!: string;

  @ManyToOne(() => UserModel, (user) => user.players)
  @JoinColumn({ name: "userID" })
  public user!: UserModel;

  @ManyToOne(() => GameModel, (game) => game.players)
  @JoinColumn({ name: "gameID" })
  public game!: GameModel;

  @Column("real", { precision: 15, scale: 2 })
  public stackAmount!: number;

  @Column({ default: () => false })
  public isTurn!: boolean;

  @Column({ default: () => false })
  public isDealer!: boolean;

  @Column({ default: () => false })
  public isSmallBlind!: boolean;

  @Column({ default: () => false })
  public isBigBlind!: boolean;

  @Column({ default: () => false })
  public isSittingOut!: boolean;

  @Column({ default: () => false })
  public pendingSitOut!: boolean;

  @Column({ default: () => false })
  public isLastAggressor!: boolean;

  @Column({ default: () => false })
  public showCards!: boolean;

  @Column({ nullable: true })
  public status!: string;

  @Column({ nullable: true })
  public bet!: string;

  @Column({ nullable: true })
  public resultDesc: string = "";

  @Column("simple-array")
  public cards!: string[];

  @Column("simple-array")
  public resultCards!: string[];

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public invested!: number;

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public result!: number;

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public pendingBuyIn!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly updatedAt!: Date;

  public subtractBet(currentBet: number): void {
    super.subtractBet(currentBet);
    getGameRepository().save(this);
  }

  public setBigBlind(blind: number): void {
    super.setBigBlind(blind);
    getGameRepository().save(this);
  }

  public setSmallBlind(blind: number): void {
    super.setSmallBlind(blind);
    getGameRepository().save(this);
  }

  public cleanPlayer(): void {
    super.cleanPlayer();
    getGameRepository().save(this);
  }
}
