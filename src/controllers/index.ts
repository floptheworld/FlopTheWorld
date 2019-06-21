import { Request, Response, Router } from "express";
import path from "path";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: path.dirname(__dirname) });
  // res.send("Hello World");
});

export const IndexController: Router = router;

export * from "./deck.controller";
