import { Request, Response, Router } from "express";
import { createDeck, shuffleDeck } from "../common/public-api";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(shuffleDeck(createDeck()));
});

export const deckController: Router = router;
