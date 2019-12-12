import { createConnection, Repository, Connection } from "typeorm";
import "reflect-metadata";

import { config } from "../config";
import { PlayerModel } from "./player-model";
import { UserModel } from "./user-model";
import { GameModel } from "./game-model";

const env: string = process.env.NODE_ENV || "development";
const envConfig = config[env as keyof typeof config];

let connectionDB: Connection;

export async function connectDB() {
  connectionDB = await createConnection({
    type: "mysql",
    host: envConfig.database.host,
    username: envConfig.database.user,
    password: envConfig.database.password,
    database: envConfig.database.name,
    entities: [PlayerModel, UserModel, GameModel],
    synchronize: true,
    // logging: true,
  });
}

export function getUserRepository(): Repository<UserModel> {
  return connectionDB.getRepository(UserModel);
}

export function getGameRepository(): Repository<GameModel> {
  return connectionDB.getRepository(GameModel);
}

export function getPlayerRepository(): Repository<PlayerModel> {
  return connectionDB.getRepository(PlayerModel);
}
