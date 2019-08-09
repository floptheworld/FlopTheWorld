import { PrimaryColumn, Column, Entity, OneToMany } from "typeorm";
import { Game } from "../game/game";
import { PlayerModel } from "./player-model";

@Entity({ name: "game" })
export class GameModel extends Game {
  @PrimaryColumn({ length: 64 })
  public gameID!: string;

  @Column({ length: 64 })
  public name!: string;

  @Column({ default: () => 0 })
  public round!: number;

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public pot!: number;

  @Column("real", { precision: 15, scale: 2 })
  public bigBlind!: number;

  @Column("real", { precision: 15, scale: 2 })
  public smallBlind!: number;

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public currentBet!: number;

  @Column("real", { precision: 15, scale: 2, default: () => 0 })
  public currentPot!: number;

  @Column()
  public cardBack!: string;

  @Column({ default: () => false })
  public isStarted!: boolean;

  @Column({ default: () => false })
  public isGameOver!: boolean;

  @Column({ default: () => false })
  public isOpen!: boolean;

  @Column({ nullable: true })
  public timer!: number;

  @Column({ default: () => 0 })
  public handCount!: number;

  @Column({ default: () => false })
  public showWinningDescription!: boolean;

  @Column({ length: 64 })
  public winDesc!: string;

  @Column({ length: 64 })
  public currentPlayerID!: string;

  @Column("simple-array")
  public board!: string[];

  @Column("simple-array")
  public deck!: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly updatedAt!: Date;

  @OneToMany(() => PlayerModel, (player) => player.game, { cascade: true })
  public players!: PlayerModel[];
}
