import { users } from "../common/const";

export default (socket: SocketIO.Socket) => {
  socket.on("connectUser", (userID: string) => {
    users.filter((user) => (user.userID = userID))[0].clientID = socket.id;
  });
};
