import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "cardtype" })
export class CardTypeModel {
  @PrimaryGeneratedColumn()
  public cardTypeID!: number;

  @Column()
  public cardType!: string;
}
