import { createServer } from "http";
import bodyParser from "body-parser";
import express from "express";
import path from "path";
import session from "express-session";
import fs = require("session-file-store");
import passport = require("passport");
import passport_local = require("passport-local");
import uuid = require("uuid");

import { createSocket } from "./socket";
import { users, games } from "./common/const";
import { User } from "./common/types";
import { getUsersByUserName, getUser } from "./common/get-user";
import { Game } from "./common/game/game";

const app: express.Application = express();
const port: number = ((process.env.PORT as any) as number) || 8080;
const cacheTime = 86400000 * 30; // 30 day Cache

const server = createServer(app);
createSocket(server);

const fileStore = fs(session);
const localStrategy = passport_local.Strategy;

passport.use(
  new localStrategy(
    { usernameField: "userName" },
    (userName, password, done) => {
      const userList: User[] = getUsersByUserName(userName);

      if (!userList[0]) {
        return done(null, false, {
          message: "Invalid Username or Password.\n",
        });
      }
      if (password !== userList[0].password) {
        return done(null, false, {
          message: "Invalid Username or Password.\n",
        });
      }

      return done(null, userList[0]);
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user.userID);
});

passport.deserializeUser((id, done) => {
  const user = getUser(id as string);

  done(null, user);
});

app.use(
  session({
    genid: (req) => {
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

app.post("/register", (req, res, next) => {
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
  const userList: User[] = getUsersByUserName(userName);

  if (userList.length > 0) {
    return res.send("That username is already taken");
  }

  const newUser: User = {
    userID: uuid(),
    userName,
    password,
    email,
    name,
  };

  users.push(newUser);
  req.user = newUser;

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

app.post("/createGame", (req, res) => {
  if (!req.body.name || !req.body.name || !req.body.bigBlind) {
    return res.send({ error: "Please fill out all fields" });
  }

  games.push(
    new Game(
      uuid(),
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

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
}
