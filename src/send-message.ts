export function sendMessage(
  io: SocketIO.Server,
  gameID: string,
  message: string
): void {
  io.sockets.in(gameID).send(message);
}
