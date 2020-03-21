import { UserType } from "../common/types";
import { getUserRepository } from "../db/db";

export default (socket: SocketIO.Socket) => {
  socket.on("connectUser", async (userID: string) => {
    const user: UserType | undefined = await getUserRepository().findOne(
      userID
    );
    if (!user) {
      return;
    }

    user.clientID = socket.id;

    getUserRepository().save(user);
  });
};
