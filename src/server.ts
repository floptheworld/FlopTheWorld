import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import { createSocket } from "./socket";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 8080;

const server = createServer(app);
createSocket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./build"));
app.use(express.static(__dirname, { extensions: ["html"] }));

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
