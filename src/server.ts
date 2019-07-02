import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { createServer } from "http";
import { createSocket } from "./socket";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 8080;
const cacheTime = 86400000 * 30; // 30 day Cache

const server = createServer(app);
createSocket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  express.static("./build", {
    maxAge: cacheTime,
  })
);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("./build/index.html"));
});

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
