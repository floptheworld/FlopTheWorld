import { users } from "./const";
import { User } from "./types";

export function getUser(userID: string): User {
  return users.find((user) => user.userID === userID)!;
}
