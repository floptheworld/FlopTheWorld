import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import { listen } from "socket.io";
import {
  createDeck,
  dealCards,
  redeal,
  shuffleDeck
} from "./common/public-api";
import { Game } from "./common/types";
import { DeckController } from "./controllers";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 3000;

const server = createServer(app);
const io = listen(server);

const games = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./build"));
app.use("/deck", DeckController);
app.use(express.static(__dirname, { extensions: ["html"] }));

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});

io.on("connection", socket => {
  // tslint:disable-next-line:no-console
  console.log("Client connected..", socket);

  socket.on("subscribeToGame", interval => {
    // tslint:disable-next-line:no-console
    console.log("client is subscribing to timer with interval ", interval);

    const players = [
      { name: "zack", cards: [] },
      { name: "zack", cards: [] },
      { name: "zack", cards: [] },
      { name: "zack", cards: [] }
    ];

    const game: Game = {
      deck: shuffleDeck(createDeck()),
      gameID: "asdf1234",
      players,
      time: new Date().toString()
    };

    dealCards(game);

    socket.emit("gameUpdate", game);
  });

  socket.on("redeal", game => {
    redeal(game);
    socket.emit("gameUpdate", game);
  });
});
