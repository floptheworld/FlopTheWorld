import { UserType } from "../common/types";
import { getConnection } from "typeorm";
import { UserModel } from "../db/user-model";

export default (socket: SocketIO.Socket) => {
  socket.on("connectUser", async (userID: string) => {
    const user: UserType | undefined = await getConnection()
      .getRepository(UserModel)
      .findOne(userID);
    if (!user) {
      return;
    }

    await getConnection()
      .getRepository(UserModel)
      .save(user);
  });
};
