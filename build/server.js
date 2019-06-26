/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common/functions.ts":
/*!*********************************!*\
  !*** ./src/common/functions.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction roundToPrecision(x, precision) {\r\n    const y = +x + (precision === undefined ? 0.5 : precision / 2);\r\n    return y - (y % (precision === undefined ? 1 : +precision));\r\n}\r\nexports.roundToPrecision = roundToPrecision;\r\n\n\n//# sourceURL=webpack:///./src/common/functions.ts?");

/***/ }),

/***/ "./src/common/public-api.ts":
/*!**********************************!*\
  !*** ./src/common/public-api.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst functions_1 = __webpack_require__(/*! ../common/functions */ \"./src/common/functions.ts\");\r\n// tslint:disable-next-line:no-var-requires\r\nconst Hand = __webpack_require__(/*! pokersolver */ \"pokersolver\").Hand;\r\nconst suits = new Set([\"H\", \"S\", \"C\", \"D\"]);\r\nconst numbers = new Set([\r\n    \"A\",\r\n    \"2\",\r\n    \"3\",\r\n    \"4\",\r\n    \"5\",\r\n    \"6\",\r\n    \"7\",\r\n    \"8\",\r\n    \"9\",\r\n    \"T\",\r\n    \"J\",\r\n    \"Q\",\r\n    \"K\",\r\n]);\r\nfunction createDeck() {\r\n    const cards = new Array();\r\n    suits.forEach((suit) => {\r\n        numbers.forEach((num) => {\r\n            cards.push(num + suit);\r\n        });\r\n    });\r\n    return cards;\r\n}\r\nexports.createDeck = createDeck;\r\nfunction shuffleDeck(deck) {\r\n    const shuffledDeck = deck;\r\n    let tempCard;\r\n    for (let i = shuffledDeck.length - 1; i > 0; i--) {\r\n        const randomPos = Math.floor(Math.random() * (i + 1));\r\n        tempCard = shuffledDeck[i];\r\n        shuffledDeck[i] = shuffledDeck[randomPos];\r\n        shuffledDeck[randomPos] = tempCard;\r\n    }\r\n    return shuffledDeck;\r\n}\r\nexports.shuffleDeck = shuffleDeck;\r\nfunction clearTable(game) {\r\n    game.players.map((player) => {\r\n        player.cards = [];\r\n        player.isTurn = false;\r\n        player.isBigBlind = false;\r\n        player.isLittleBlind = false;\r\n    });\r\n    game.board = [];\r\n    game.deck = [];\r\n    game.round = 0;\r\n    game.pot = 0;\r\n    game.winDesc = \"\";\r\n}\r\nexports.clearTable = clearTable;\r\nfunction dealCards(game) {\r\n    const players = game.players;\r\n    players.map((player) => {\r\n        while (player.cards.length < 2) {\r\n            player.cards.push(game.deck.pop());\r\n        }\r\n    });\r\n}\r\nexports.dealCards = dealCards;\r\nfunction addPlayer(game, id, users) {\r\n    const newPlayer = {\r\n        cards: [],\r\n        name: users.find((user) => user.userID === id).userName,\r\n        playerID: id,\r\n        stackAmount: 5.0,\r\n        isTurn: false,\r\n        dealer: false,\r\n        isLittleBlind: false,\r\n        isBigBlind: false,\r\n        status: \"\",\r\n        bet: \"\",\r\n    };\r\n    game.players.push(newPlayer);\r\n}\r\nexports.addPlayer = addPlayer;\r\nfunction createGame() {\r\n    return {\r\n        board: [],\r\n        deck: [],\r\n        gameID: \"asdf1234\",\r\n        // gameID: uuid(),\r\n        players: [],\r\n        pot: 0,\r\n        round: 0,\r\n        currentBet: 0,\r\n        currentPot: 0,\r\n        bigBlind: 0.1,\r\n        littleBlind: 0.05,\r\n        currentPlayerID: \"\",\r\n        cardBack: \"gray_back\",\r\n        winDesc: \"\",\r\n    };\r\n}\r\nexports.createGame = createGame;\r\nfunction getGameState(currentGame, playerID) {\r\n    return Object.assign({\r\n        board: currentGame.board,\r\n        gameID: currentGame.gameID,\r\n        players: getGameStatePlayers(currentGame.players, playerID, currentGame.cardBack),\r\n        pot: currentGame.pot,\r\n        round: currentGame.round,\r\n        bigBlind: currentGame.bigBlind,\r\n        littleBlind: currentGame.littleBlind,\r\n        currentBet: currentGame.currentBet,\r\n        currentPot: currentGame.currentPot,\r\n        currentPlayerID: playerID,\r\n        cardBack: currentGame.cardBack,\r\n        winDesc: currentGame.winDesc,\r\n    });\r\n}\r\nexports.getGameState = getGameState;\r\nfunction getGameStatePlayers(players, currentPlayerID, cardBack) {\r\n    const copyPlayers = players.map((player) => (Object.assign({}, player)));\r\n    copyPlayers\r\n        .filter((player) => player.playerID !== currentPlayerID && player.cards.length > 0)\r\n        .map((player) => {\r\n        player.cards = [cardBack, cardBack];\r\n    });\r\n    return copyPlayers;\r\n}\r\nfunction getGame(games, gameID) {\r\n    return games[games.findIndex((game) => game.gameID === gameID)];\r\n}\r\nexports.getGame = getGame;\r\nfunction startGame(game) {\r\n    clearTable(game);\r\n    clearPlayers(game);\r\n    game.deck = shuffleDeck(createDeck());\r\n    dealCards(game);\r\n    updateNextDealer(game);\r\n    updateBlinds(game);\r\n    const bigBlindIndex = game.players.findIndex((player) => player.isBigBlind === true);\r\n    if (game.players[bigBlindIndex + 1]) {\r\n        game.players[bigBlindIndex + 1].isTurn = true;\r\n    }\r\n    else {\r\n        game.players[0].isTurn = true;\r\n    }\r\n    game.currentBet = game.bigBlind;\r\n    game.currentPot = game.bigBlind + game.littleBlind;\r\n}\r\nexports.startGame = startGame;\r\nfunction nextRound(game) {\r\n    game.round++;\r\n    game.currentBet = 0;\r\n    game.currentPot = 0;\r\n    updatePot(game);\r\n    clearActivePlayers(game);\r\n    switch (game.round) {\r\n        case 1:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        case 2:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        case 3:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        default:\r\n            solveHands(game);\r\n        // startGame(game);\r\n    }\r\n}\r\nexports.nextRound = nextRound;\r\nfunction isPlayerAction(game, id) {\r\n    return game.players.filter((player) => player.playerID === id && player.isTurn === true)[0];\r\n}\r\nexports.isPlayerAction = isPlayerAction;\r\nfunction playerAction(game, player, action, data) {\r\n    const dataNum = parseFloat(data);\r\n    if (data !== \"\" && isNaN(dataNum)) {\r\n        return;\r\n    }\r\n    switch (action) {\r\n        case \"fold\":\r\n            player.cards = [];\r\n            break;\r\n        case \"check\":\r\n            break;\r\n        case \"call\":\r\n            subtractBetFromPlayerStack(game, player);\r\n            game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);\r\n            player.bet = game.currentBet.toFixed(2);\r\n            break;\r\n        case \"bet\":\r\n        case \"raise\":\r\n            game.currentBet = dataNum;\r\n            subtractBetFromPlayerStack(game, player);\r\n            game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);\r\n            player.bet = parseFloat(data).toFixed(2);\r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n    player.status = action;\r\n}\r\nexports.playerAction = playerAction;\r\nfunction nextPlayerTurn(game) {\r\n    if (game.players.filter((player) => player.status !== \"fold\").length === 1) {\r\n        game.players\r\n            .filter((player) => player.status !== \"fold\")\r\n            .map((player) => {\r\n            player.stackAmount += game.pot + game.currentPot;\r\n        });\r\n        startGame(game);\r\n        return;\r\n    }\r\n    const playerIndex = game.players.findIndex((player) => player.isTurn === true);\r\n    let firstTurnIndex = game.players.findIndex((player) => player.isLittleBlind === true);\r\n    let nextPlayerIndex = playerIndex + 1;\r\n    game.players[playerIndex].isTurn = false;\r\n    while (!game.players[nextPlayerIndex] ||\r\n        game.players[nextPlayerIndex].cards.length < 1 ||\r\n        game.players[nextPlayerIndex].stackAmount === 0) {\r\n        if (!game.players[nextPlayerIndex]) {\r\n            nextPlayerIndex = 0;\r\n        }\r\n        else {\r\n            nextPlayerIndex++;\r\n        }\r\n    }\r\n    if ((game.players[nextPlayerIndex].status === \"check\" &&\r\n        game.currentBet === 0) ||\r\n        nextPlayerIndex === playerIndex ||\r\n        parseFloat(game.players[nextPlayerIndex].bet).toFixed(2) ===\r\n            game.currentBet.toFixed(2)) {\r\n        while (!game.players[firstTurnIndex] ||\r\n            game.players[firstTurnIndex].cards.length < 1 ||\r\n            game.players[firstTurnIndex].stackAmount === 0) {\r\n            if (!game.players[firstTurnIndex]) {\r\n                firstTurnIndex = 0;\r\n            }\r\n            else {\r\n                firstTurnIndex++;\r\n            }\r\n        }\r\n        game.players[firstTurnIndex].isTurn = true;\r\n        nextRound(game);\r\n        return;\r\n    }\r\n    game.players[nextPlayerIndex].isTurn = true;\r\n}\r\nexports.nextPlayerTurn = nextPlayerTurn;\r\nfunction updateNextDealer(game) {\r\n    const dealerIndex = game.players.findIndex((player) => player.dealer === true);\r\n    if (dealerIndex === -1) {\r\n        game.players[0].dealer = true;\r\n        return;\r\n    }\r\n    if (game.players[dealerIndex + 1]) {\r\n        game.players[dealerIndex].dealer = false;\r\n        game.players[dealerIndex + 1].dealer = true;\r\n        return;\r\n    }\r\n    game.players[game.players.length - 1].dealer = false;\r\n    game.players[0].dealer = true;\r\n}\r\nexports.updateNextDealer = updateNextDealer;\r\nfunction updateBlinds(game) {\r\n    const dealerIndex = game.players.findIndex((player) => player.dealer === true);\r\n    if (game.players[dealerIndex + 1]) {\r\n        game.players[dealerIndex + 1].isLittleBlind = true;\r\n        game.players[dealerIndex + 1].bet = game.littleBlind.toString();\r\n        game.players[dealerIndex + 1].stackAmount -= game.littleBlind;\r\n    }\r\n    else {\r\n        game.players[0].isLittleBlind = true;\r\n        game.players[0].bet = game.littleBlind.toString();\r\n        game.players[0].stackAmount -= game.littleBlind;\r\n    }\r\n    const littleBlindIndex = game.players.findIndex((player) => player.isLittleBlind === true);\r\n    if (game.players[littleBlindIndex + 1]) {\r\n        game.players[littleBlindIndex + 1].isBigBlind = true;\r\n        game.players[littleBlindIndex + 1].bet = game.bigBlind.toString();\r\n        game.players[littleBlindIndex + 1].stackAmount -= game.bigBlind;\r\n    }\r\n    else {\r\n        game.players[0].isBigBlind = true;\r\n        game.players[0].bet = game.bigBlind.toString();\r\n        game.players[0].stackAmount -= game.bigBlind;\r\n    }\r\n}\r\nexports.updateBlinds = updateBlinds;\r\nfunction updatePot(game) {\r\n    game.players\r\n        .filter((player) => player.bet !== \"\")\r\n        .map((player) => (game.pot = game.pot + parseFloat(player.bet)));\r\n}\r\nexports.updatePot = updatePot;\r\nfunction clearPlayers(game) {\r\n    game.players.map((player) => {\r\n        player.bet = \"\";\r\n        player.status = \"\";\r\n    });\r\n}\r\nexports.clearPlayers = clearPlayers;\r\nfunction clearActivePlayers(game) {\r\n    game.players.map((player) => {\r\n        player.bet = \"\";\r\n        if (player.status !== \"fold\") {\r\n            player.status = \"\";\r\n        }\r\n    });\r\n}\r\nexports.clearActivePlayers = clearActivePlayers;\r\nfunction subtractBetFromPlayerStack(game, player) {\r\n    player.stackAmount =\r\n        functions_1.roundToPrecision(player.stackAmount, 0.01) -\r\n            (functions_1.roundToPrecision(game.currentBet, 0.01) -\r\n                functions_1.roundToPrecision(parseFloat(player.bet) || 0, 0.01));\r\n}\r\nexports.subtractBetFromPlayerStack = subtractBetFromPlayerStack;\r\nfunction solveHands(game) {\r\n    const solvedHands = [];\r\n    let boardWinner = true;\r\n    game.players.map((player) => {\r\n        solvedHands.push(Hand.solve(player.cards.concat(game.board)));\r\n    });\r\n    const winners = Hand.winners(solvedHands);\r\n    winners.map((winner) => {\r\n        let winningHand = [];\r\n        winningHand = winner.cards.map((c) => c.wildValue + c.suit.toUpperCase());\r\n        game.players.map((player) => {\r\n            if (player.cards.some((card) => winningHand.includes(card))) {\r\n                player.stackAmount += game.pot / winners.length;\r\n                boardWinner = false;\r\n            }\r\n        });\r\n    });\r\n    if (boardWinner) {\r\n        const availPlayers = game.players.filter((player) => player.cards.length > 0).length;\r\n        game.players\r\n            .filter((player) => player.cards.length > 0)\r\n            .map((player) => (player.stackAmount += game.pot / availPlayers));\r\n    }\r\n    game.winDesc = winners[0].descr;\r\n}\r\nexports.solveHands = solveHands;\r\n\n\n//# sourceURL=webpack:///./src/common/public-api.ts?");

/***/ }),

/***/ "./src/controllers/deck.controller.ts":
/*!********************************************!*\
  !*** ./src/controllers/deck.controller.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst express_1 = __webpack_require__(/*! express */ \"express\");\r\nconst public_api_1 = __webpack_require__(/*! ../common/public-api */ \"./src/common/public-api.ts\");\r\nconst router = express_1.Router();\r\nrouter.get(\"/\", (req, res) => {\r\n    res.send(public_api_1.shuffleDeck(public_api_1.createDeck()));\r\n});\r\nexports.deckController = router;\r\n\n\n//# sourceURL=webpack:///./src/controllers/deck.controller.ts?");

/***/ }),

/***/ "./src/controllers/index.ts":
/*!**********************************!*\
  !*** ./src/controllers/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ./deck.controller */ \"./src/controllers/deck.controller.ts\"));\r\n\n\n//# sourceURL=webpack:///./src/controllers/index.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\r\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nconst http_1 = __webpack_require__(/*! http */ \"http\");\r\nconst controllers_1 = __webpack_require__(/*! ./controllers */ \"./src/controllers/index.ts\");\r\nconst socket_1 = __webpack_require__(/*! ./socket */ \"./src/socket.ts\");\r\nconst app = express_1.default();\r\nconst port = process.env.PORT || 8080;\r\nconst server = http_1.createServer(app);\r\nsocket_1.createSocket(server);\r\napp.use(body_parser_1.default.json());\r\napp.use(body_parser_1.default.urlencoded({ extended: false }));\r\napp.use(express_1.default.static(\"./build\"));\r\napp.use(\"/deck\", controllers_1.deckController);\r\napp.use(express_1.default.static(__dirname, { extensions: [\"html\"] }));\r\nserver.listen(port, () => {\r\n    // tslint:disable-next-line:no-console\r\n    console.log(`Listening at http://localhost:${port}/`);\r\n});\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/server.ts?");

/***/ }),

/***/ "./src/socket.ts":
/*!***********************!*\
  !*** ./src/socket.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst socket_io_1 = __webpack_require__(/*! socket.io */ \"socket.io\");\r\nconst uuid = __webpack_require__(/*! uuid */ \"uuid\");\r\nconst public_api_1 = __webpack_require__(/*! ./common/public-api */ \"./src/common/public-api.ts\");\r\nconst games = [];\r\nconst users = [];\r\ngames.push(public_api_1.createGame());\r\nfunction createSocket(server) {\r\n    const io = socket_io_1.listen(server);\r\n    io.on(\"connection\", (socket) => {\r\n        // tslint:disable-next-line:no-console\r\n        console.log(\"Client connected...\");\r\n        socket.on(\"findOrCreatePlayer\", (userID, userName, fn) => {\r\n            if (!users.find((user) => user.userID === userID)) {\r\n                userID = uuid();\r\n                users.push({ userID, clientID: socket.id, userName });\r\n            }\r\n            else {\r\n                users\r\n                    .filter((user) => user.userID === userID)\r\n                    .map((user) => {\r\n                    try {\r\n                        io.sockets.sockets[user.clientID].disconnect();\r\n                    }\r\n                    catch (error) {\r\n                        // tslint:disable-next-line:no-console\r\n                        console.log(error);\r\n                    }\r\n                    user.clientID = socket.id;\r\n                });\r\n            }\r\n            fn(users.find((user) => user.userID === userID));\r\n        });\r\n        socket.on(\"subscribeToGame\", (gameID, userID) => {\r\n            // tslint:disable-next-line:no-console\r\n            console.log(`client is subscribing the game: ${gameID} @ ${userID}`);\r\n            socket.join(gameID);\r\n            const currentGame = public_api_1.getGame(games, gameID);\r\n            if (!currentGame.players.find((player) => player.playerID === userID)) {\r\n                public_api_1.addPlayer(currentGame, userID, users);\r\n            }\r\n            updateGameState(io, currentGame);\r\n        });\r\n        socket.on(\"startGame\", (gameID) => {\r\n            const currentGame = public_api_1.getGame(games, gameID);\r\n            public_api_1.startGame(currentGame);\r\n            updateGameState(io, currentGame);\r\n        });\r\n        socket.on(\"nextRound\", (gameID) => {\r\n            const currentGame = public_api_1.getGame(games, gameID);\r\n            public_api_1.nextRound(currentGame);\r\n            updateGameState(io, currentGame);\r\n        });\r\n        socket.on(\"playerAction\", (gameID, userID, action, data) => {\r\n            const currentGame = public_api_1.getGame(games, gameID);\r\n            const player = public_api_1.isPlayerAction(currentGame, userID);\r\n            if (!player) {\r\n                return;\r\n            }\r\n            public_api_1.playerAction(currentGame, player, action, data);\r\n            public_api_1.nextPlayerTurn(currentGame);\r\n            updateGameState(io, currentGame);\r\n            if (currentGame.winDesc !== \"\") {\r\n                setTimeout(() => {\r\n                    public_api_1.startGame(currentGame);\r\n                    updateGameState(io, currentGame);\r\n                }, 2000);\r\n            }\r\n        });\r\n    });\r\n}\r\nexports.createSocket = createSocket;\r\nfunction updateGameState(io, game) {\r\n    io.sockets.in(game.gameID).clients((err, clients) => {\r\n        clients.map((client) => {\r\n            io.to(client).emit(\"gameUpdate\", public_api_1.getGameState(game, users.find((user) => user.clientID === client).userID));\r\n        });\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/socket.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "pokersolver":
/*!******************************!*\
  !*** external "pokersolver" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pokersolver\");\n\n//# sourceURL=webpack:///external_%22pokersolver%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ });