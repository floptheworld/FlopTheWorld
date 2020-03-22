import io from "socket.io-client";
import { GameState, UserType } from "../common/types";
import { postJSONData, getJSONData } from "../common/fetch-data";

export async function createConnection(
  userID: string
): Promise<SocketIOClient.Socket> {
  const socket = io("/", { transports: ["polling"] });
  socket.emit("connectUser", userID);
  return socket;
}

export async function connectToGame(
  socket: SocketIOClient.Socket,
  userID: string,
  setState: (state: GameState) => void
): Promise<SocketIOClient.Socket> {
  socket.on("gameUpdate", (state: GameState) => {
    setState(state);
  });

  socket.on("sound", (sound: string) => {
    const beep = new Audio(`../../static/sounds/${sound}`);
    beep.play();
  });

  socket.emit("subscribeToGame", localStorage.gameID, userID);

  return socket;
}

export async function subscribeToMessage(
  socket: SocketIOClient.Socket,
  addMessage: (message: string) => void
) {
  socket.on("message", (message: string) => {
    addMessage(message);
  });
}

export async function getGames(
  socket: SocketIOClient.Socket,
  setGames: (games: []) => void
): Promise<void> {
  socket.emit("getGames", (games: []) => {
    setGames(games);
  });
}

export function sendPlayerAction(
  socket: SocketIOClient.Socket,
  userID: string,
  gameID: string,
  action: string,
  amount: string
) {
  socket.emit("playerAction", gameID, userID, action, amount);
}

export function startGame(socket: SocketIOClient.Socket, gameID: string) {
  socket.emit("startGame", gameID);
}

export function leaveGame(
  socket: SocketIOClient.Socket,
  userID: string,
  gameID: string
) {
  socket.emit("leaveGame", gameID, userID);
  setTimeout(() => {
    document.location.href = "/";
  }, 500);
}

export function callClock(socket: SocketIOClient.Socket, gameID: string) {
  socket.emit("callClock", gameID);
}

export function sendMessage(
  socket: SocketIOClient.Socket,
  name: string,
  gameID: string,
  message: string
) {
  socket.emit("message", gameID, name, message);
}

export async function login(
  userName: string,
  password: string
): Promise<UserType | string> {
  const res = await postJSONData("./login", { userName, password });

  return res;
}

export async function register(
  name: string,
  userName: string,
  email: string,
  password: string,
  cpassword: string
): Promise<UserType | string> {
  const res = await postJSONData("./register", {
    name,
    userName,
    email,
    password,
    cpassword,
  });
  return res;
}

export async function getUser(): Promise<UserType> {
  const res = await getJSONData("/getUser");
  return res;
}

export async function createGame(
  name: string,
  smallBlind: string,
  bigBlind: string
): Promise<{ error: string }> {
  const res = await postJSONData("./createGame", {
    name,
    smallBlind,
    bigBlind,
  });
  return res;
}
