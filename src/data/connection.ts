import io from "socket.io-client";
import axios from "axios";
import { GameState, User } from "../common/types";

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
  document.location.href = "/";
}

export function callClock(socket: SocketIOClient.Socket, gameID: string) {
  socket.emit("callClock", gameID);
}

export function sendMessage(
  socket: SocketIOClient.Socket,
  userID: string,
  gameID: string,
  message: string
) {
  socket.emit("message", gameID, userID, message);
}

export async function login(
  userName: string,
  password: string
): Promise<User | string> {
  const res = await axios.post("./login", { userName, password });
  return res.data;
}

export async function register(
  name: string,
  userName: string,
  email: string,
  password: string,
  cpassword: string
): Promise<User | string> {
  const res = await axios.post("./register", {
    name,
    userName,
    email,
    password,
    cpassword,
  });
  return res.data;
}

export async function getUser(): Promise<User> {
  const res = await axios.get("/getUser");
  return res.data;
}

export async function createGame(
  name: string,
  smallBlind: string,
  bigBlind: string
): Promise<{ error: string }> {
  const res = await axios.post("./createGame", {
    name,
    smallBlind,
    bigBlind,
  });
  return res.data;
}
