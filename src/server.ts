import express from "express";

import { DeckController } from "./controllers";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 3000;

app.use(express.static("static"));

app.use("/deck", DeckController);

app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
