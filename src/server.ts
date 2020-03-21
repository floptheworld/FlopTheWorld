import bodyParser from "body-parser";
import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";

import { createServer } from "http";
import { getConnection, Like, Repository } from "typeorm";

import fs = require("session-file-store");
import passport = require("passport");
import passport_local = require("passport-local");
import uuid = require("uuid");

import { createSocket } from "./socket";
import { games } from "./common/const";
import { Game } from "./game/game";
import { UserType } from "./common/types";
import { UserModel } from "./db/user-model";

import { connectDB, getGameRepository } from "./db/db";
import { getGamePlayerUserClientsFromDB } from "./common/game-player-client";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 8080;

const cacheTime = 86400000 * 30; // 30 day Cache

const saltRounds = 10;

(async () => {
  const server = createServer(app);
  createSocket(server);
  await connectDB();

  getGamePlayerUserClientsFromDB();

  const fileStore = fs(session);
  const localStrategy = passport_local.Strategy;

  passport.use(
    new localStrategy(
      { usernameField: "userName" },
      async (userName, password, done) => {
        const userFound: UserType | undefined = await getConnection()
          .getRepository(UserModel)
          .findOne({
            userName: Like(userName),
          });

        if (!userFound) {
          return done(null, false, {
            message: "Invalid Username or Password.\n",
          });
        }

        if (!bcrypt.compareSync(password, userFound.password)) {
          return done(null, false, {
            message: "Invalid Username or Password.\n",
          });
        }

        return done(null, userFound);
      }
    )
  );

  passport.serializeUser((user: UserType, done) => {
    done(null, user.userID);
  });

  passport.deserializeUser(async (id: string, done) => {
    const userFound = await getConnection()
      .getRepository(UserModel)
      .findOne(id);

    done(null, userFound);
  });

  app.use(
    session({
      genid: () => {
        return uuid();
      },
      store: new fileStore(),
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    express.static("./build", {
      maxAge: cacheTime,
    })
  );

  app.get("/lobby", isAuthenticated, (req, res) => {
    res.sendFile(path.resolve("./build/lobby.html"));
  });

  app.post("/login", (req, res, next) => {
    passport.authenticate("local", (perr, user, info) => {
      if (info || !user) {
        return res.send("Invalid Username or Password.");
      }
      if (perr) {
        return next(perr);
      }
      req.login(user, (lerr) => {
        if (lerr) {
          return next(lerr);
        }

        return res.send(user);
      });
    })(req, res, next);
  });

  app.get("/logout", (req, res, next) => {
    req.logOut();
    if (!req.session) {
      return res.redirect("/");
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      req.session = undefined;
      res.redirect("/");
    });
  });

  app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/lobby");
    }
    res.sendFile(path.resolve("./build/register.html"));
  });

  app.post("/register", async (req, res, next) => {
    const userName = req.body.userName;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (!name) {
      return res.send("Please enter a Name");
    }
    if (!userName) {
      return res.send("Please enter a Username");
    }
    if (!email) {
      return res.send("Please enter an Email");
    }
    if (password !== cpassword) {
      return res.send("Passwords do not Match");
    }
    if (password.length < 4) {
      return res.send("Password must be at least 4 characters");
    }

    const connection: Repository<
      UserModel
    > = await getConnection().getRepository(UserModel);

    const userFound: UserType | undefined = await connection.findOne({
      userName: Like(userName),
    });

    if (userFound) {
      return res.send("That username is already taken");
    }

    const hash = bcrypt.hashSync(password, saltRounds);
    req.user = await connection.save({
      userID: uuid(),
      name,
      userName,
      email,
      password: hash,
    });

    passport.authenticate("local", (perr, user, info) => {
      if (info || !user) {
        return res.send("Invalid Username or Password.");
      }
      if (perr) {
        return next(perr);
      }

      req.login(user, (lerr) => {
        if (lerr) {
          return next(lerr);
        }

        return res.send(user);
      });
    })(req, res, next);
  });

  app.get("/getUser", (req, res) => {
    res.send(req.user);
  });

  app.get("/game/:gameID", isAuthenticated, (req, res) => {
    res.sendFile(path.resolve("./build/game.html"));
  });

  app.post("/createGame", async (req, res) => {
    if (!req.body.name || !req.body.name || !req.body.bigBlind) {
      return res.send({ error: "Please fill out all fields" });
    }

    getGameRepository().save(
      new Game(
        req.body.name,
        parseFloat(req.body.bigBlind),
        parseFloat(req.body.smallBlind),
        "gray_back"
      )
    );

    return res.send({});
  });

  app.get("/*", (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/lobby");
    }

    if (req.url !== "/") {
      return res.redirect("/");
    }

    res.sendFile(path.resolve("./build/login.html"));
  });

  server.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Listening at http://localhost:${port}/`);
  });
})();

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
}

export async function updateGames() {
  await getGameRepository()
    .find({ relations: ["players", "players.user"] })
    .then((gs) =>
      gs.map((game) => {
        const index = games.findIndex((g) => g.gameID === game.gameID);

        if (index === -1) {
          games.push(game);
        } else {
          games[index] = game;
        }
      })
    );
}
