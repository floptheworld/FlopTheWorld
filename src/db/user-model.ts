import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { PlayerModel } from "./player-model";
import { User } from "../user/user";

@Entity({ name: "user" })
export class UserModel extends User {
  @PrimaryColumn({ length: 64 })
  public userID!: string;

  @Column({ length: 64 })
  public name!: string;

  @Column({ length: 128 })
  public userName!: string;

  @Column({ length: 64 })
  public password!: string;

  @Column({ length: 64, nullable: true })
  public clientID?: string;

  @Column({ length: 128 })
  public email!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public readonly updatedAt!: Date;

  @OneToMany(() => PlayerModel, (player) => player.user)
  public players?: PlayerModel[];
}
