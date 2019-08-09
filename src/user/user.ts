import { UserType } from "../common/types";

export class User implements UserType {
  public userID!: string;
  public userName!: string;
  public clientID?: string;
  public email!: string;
  public password!: string;
  public name!: string;
}
