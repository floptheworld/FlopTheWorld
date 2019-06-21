import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import path from "path";
import { listen } from "socket.io";
import { DeckController, IndexController } from "./controllers";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 3000;

const server = createServer(app);
const io = listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("static"));
app.use("/deck", DeckController);
app.use(express.static(__dirname, { extensions: ["html"] }));

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});

io.on("connection", socket => {
  console.log("Client connected..");

  socket.send("Testing Message");

  socket.on("join", data => {
    console.log(data);
  });
});
