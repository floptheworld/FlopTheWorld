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

/***/ "./src/common/const.ts":
/*!*****************************!*\
  !*** ./src/common/const.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.suits = new Set([\"H\", \"S\", \"C\", \"D\"]);\r\nexports.numbers = new Set([\r\n    \"A\",\r\n    \"2\",\r\n    \"3\",\r\n    \"4\",\r\n    \"5\",\r\n    \"6\",\r\n    \"7\",\r\n    \"8\",\r\n    \"9\",\r\n    \"T\",\r\n    \"J\",\r\n    \"Q\",\r\n    \"K\",\r\n]);\r\nexports.games = [];\r\nexports.users = [];\r\n// Test\r\n// ================================================================================\r\n// game.players[0].cards = [\"3D\", \"4S\"];\r\n// game.players[1].cards = [\"5H\", \"6C\"];\r\n// game.players[2].cards = [\"4D\", \"5S\"];\r\n// game.board = [\"AC\", \"JD\", \"JH\", \"AD\", \"JS\"];\r\n// Three way tie, side pots\r\n// game.players[0].cards = [\"QS\", \"JS\"];\r\n//   game.players[0].invested = 50;\r\n//   game.players[1].cards = [\"QD\", \"3D\"];\r\n//   game.players[1].invested = 100;\r\n//   game.players[2].cards = [\"QH\", \"5S\"];\r\n//   game.players[2].invested = 150;\r\n//   game.board = [\"AS\", \"KS\", \"7D\", \"7C\", \"9H\"];\r\n// ================================================================================\r\n\n\n//# sourceURL=webpack:///./src/common/const.ts?");

/***/ }),

/***/ "./src/common/create-deck.ts":
/*!***********************************!*\
  !*** ./src/common/create-deck.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst const_1 = __webpack_require__(/*! ./const */ \"./src/common/const.ts\");\r\nfunction createDeck() {\r\n    const cards = new Array();\r\n    const_1.suits.forEach((suit) => {\r\n        const_1.numbers.forEach((num) => {\r\n            cards.push(num + suit);\r\n        });\r\n    });\r\n    return cards;\r\n}\r\nexports.createDeck = createDeck;\r\n\n\n//# sourceURL=webpack:///./src/common/create-deck.ts?");

/***/ }),

/***/ "./src/common/game/clear-table.ts":
/*!****************************************!*\
  !*** ./src/common/game/clear-table.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction clearTable(game) {\r\n    game.players.map((player) => {\r\n        player.cards = [];\r\n        player.isTurn = false;\r\n        player.isBigBlind = false;\r\n        player.isLittleBlind = false;\r\n        player.invested = 0;\r\n        player.result = 0;\r\n    });\r\n    game.board = [];\r\n    game.deck = [];\r\n    game.pots = [];\r\n    game.round = 0;\r\n    game.pot = 0;\r\n    game.winDesc = \"\";\r\n}\r\nexports.clearTable = clearTable;\r\n\n\n//# sourceURL=webpack:///./src/common/game/clear-table.ts?");

/***/ }),

/***/ "./src/common/game/create-game.ts":
/*!****************************************!*\
  !*** ./src/common/game/create-game.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction createGame() {\r\n    return {\r\n        board: [],\r\n        deck: [],\r\n        gameID: \"asdf1234\",\r\n        // gameID: uuid(),\r\n        players: [],\r\n        pot: 0,\r\n        round: 0,\r\n        currentBet: 0,\r\n        currentPot: 0,\r\n        bigBlind: 0.1,\r\n        littleBlind: 0.05,\r\n        currentPlayerID: \"\",\r\n        cardBack: \"gray_back\",\r\n        winDesc: \"\",\r\n        pots: [],\r\n    };\r\n}\r\nexports.createGame = createGame;\r\n\n\n//# sourceURL=webpack:///./src/common/game/create-game.ts?");

/***/ }),

/***/ "./src/common/game/get-game-state.ts":
/*!*******************************************!*\
  !*** ./src/common/game/get-game-state.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst get_game_state_players_1 = __webpack_require__(/*! ../player/get-game-state-players */ \"./src/common/player/get-game-state-players.ts\");\r\nfunction getGameState(currentGame, playerID) {\r\n    return Object.assign({\r\n        board: currentGame.board,\r\n        gameID: currentGame.gameID,\r\n        players: get_game_state_players_1.getGameStatePlayers(currentGame.players, playerID, currentGame.cardBack),\r\n        pot: currentGame.pot,\r\n        round: currentGame.round,\r\n        bigBlind: currentGame.bigBlind,\r\n        littleBlind: currentGame.littleBlind,\r\n        currentBet: currentGame.currentBet,\r\n        currentPot: currentGame.currentPot,\r\n        currentPlayerID: playerID,\r\n        cardBack: currentGame.cardBack,\r\n        winDesc: currentGame.winDesc,\r\n        pots: currentGame.pots,\r\n    });\r\n}\r\nexports.getGameState = getGameState;\r\n\n\n//# sourceURL=webpack:///./src/common/game/get-game-state.ts?");

/***/ }),

/***/ "./src/common/game/get-game.ts":
/*!*************************************!*\
  !*** ./src/common/game/get-game.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst const_1 = __webpack_require__(/*! ../const */ \"./src/common/const.ts\");\r\nfunction getGame(gameID) {\r\n    return const_1.games[const_1.games.findIndex((game) => game.gameID === gameID)];\r\n}\r\nexports.getGame = getGame;\r\n\n\n//# sourceURL=webpack:///./src/common/game/get-game.ts?");

/***/ }),

/***/ "./src/common/game/next-round.ts":
/*!***************************************!*\
  !*** ./src/common/game/next-round.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst clear_active_players_1 = __webpack_require__(/*! ../player/clear-active-players */ \"./src/common/player/clear-active-players.ts\");\r\nconst update_pot_1 = __webpack_require__(/*! ./update-pot */ \"./src/common/game/update-pot.ts\");\r\nconst solve_hands_1 = __webpack_require__(/*! ./solve-hands */ \"./src/common/game/solve-hands.ts\");\r\nconst round_to_precision_1 = __webpack_require__(/*! ../round-to-precision */ \"./src/common/round-to-precision.ts\");\r\nfunction nextRound(game) {\r\n    game.round++;\r\n    game.currentBet = 0;\r\n    game.currentPot = 0;\r\n    update_pot_1.updatePot(game);\r\n    clear_active_players_1.clearActivePlayers(game);\r\n    switch (game.round) {\r\n        case 1:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        case 2:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        case 3:\r\n            game.deck.pop();\r\n            game.board.push(game.deck.pop());\r\n            break;\r\n        default:\r\n            solve_hands_1.solveHands(game);\r\n            return;\r\n    }\r\n    let minInvested = 0;\r\n    const investedTemp = [];\r\n    game.players.map((player) => investedTemp.push(player.invested));\r\n    let investedPlayers = game.players.filter((player) => player.invested > 0);\r\n    let index = 0;\r\n    while (investedPlayers.length > 0) {\r\n        // Find the Minimum Invested Player and store that amount\r\n        minInvested = investedPlayers.reduce((prev, curr) => prev.invested < curr.invested ? prev : curr).invested;\r\n        // Create a Side pot of the Min Invested Amount * How many players invest atleast that much\r\n        if (game.pots[index] === undefined) {\r\n            game.pots.push(0);\r\n        }\r\n        game.pots[index] += round_to_precision_1.roundToPrecision(round_to_precision_1.roundToPrecision(minInvested, 0.01) * investedPlayers.length, 0.01);\r\n        // Subtract the Min Invested from each players investment\r\n        investedPlayers.map((player) => (player.invested = round_to_precision_1.roundToPrecision(player.invested - minInvested, 0.01)));\r\n        investedPlayers = investedPlayers.filter((player) => player.invested > 0);\r\n        index++;\r\n    }\r\n    game.players.map((player, i) => (player.invested = investedTemp[i]));\r\n}\r\nexports.nextRound = nextRound;\r\n\n\n//# sourceURL=webpack:///./src/common/game/next-round.ts?");

/***/ }),

/***/ "./src/common/game/solve-hands.ts":
/*!****************************************!*\
  !*** ./src/common/game/solve-hands.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// tslint:disable-next-line:no-var-requires\r\nconst Hand = __webpack_require__(/*! pokersolver */ \"pokersolver\").Hand;\r\nconst round_to_precision_1 = __webpack_require__(/*! ../round-to-precision */ \"./src/common/round-to-precision.ts\");\r\nfunction solveHands(game) {\r\n    let solvedHands = [];\r\n    let boardWinner = true;\r\n    let winners = [];\r\n    let sidePot = 0;\r\n    let minInvested = 0;\r\n    let investedPlayers = game.players.filter((player) => player.invested > 0);\r\n    let livePlayers = investedPlayers.filter((player) => player.status !== \"fold\");\r\n    // While there are still players with invested money\r\n    while (investedPlayers.length > 0) {\r\n        // Find the Minimum Invested Player and store that amount\r\n        minInvested = investedPlayers.reduce((prev, curr) => prev.invested < curr.invested ? prev : curr).invested;\r\n        // Create a Side pot of the Min Invested Amount * How many players invest atleast that much\r\n        sidePot = round_to_precision_1.roundToPrecision(round_to_precision_1.roundToPrecision(minInvested, 0.01) * investedPlayers.length, 0.01);\r\n        // Solve the hands of all players who arent folded\r\n        livePlayers.map((player) => {\r\n            solvedHands.push(Hand.solve(player.cards.concat(game.board)));\r\n        });\r\n        // Find the Winning Hand/s - Could be Multiple if there is a tie\r\n        winners = Hand.winners(solvedHands);\r\n        // For Each Winning Hand, find the player that the hand belongs to and split the pot by the number of winners\r\n        winners.map((winner) => {\r\n            let winningHand = [];\r\n            // Upper case each Card Value to match the servers cards\r\n            winningHand = winner.cards.map((c) => c.wildValue + c.suit.toUpperCase());\r\n            // For each Player that hasn't folded, check the winning hand against their hand\r\n            livePlayers.map((player, ind) => {\r\n                if (player.cards.some((card) => winningHand.includes(card))) {\r\n                    // Add to the player's result the pot split by how many players won\r\n                    player.result += sidePot / winners.length;\r\n                    boardWinner = false;\r\n                }\r\n            });\r\n        });\r\n        // If the board wins, i.e. No cards in the players hands played\r\n        if (boardWinner) {\r\n            // Split the Pot between each player that hasn't folded\r\n            livePlayers.map((player) => (player.result += sidePot / livePlayers.length));\r\n        }\r\n        // Subtract the Min Invested from each players investment\r\n        investedPlayers.map((player) => (player.invested = round_to_precision_1.roundToPrecision(player.invested - minInvested, 0.01)));\r\n        // Update the invested players as at least 1 player should be dropped off every loop\r\n        investedPlayers = investedPlayers.filter((player) => player.invested > 0);\r\n        livePlayers = investedPlayers.filter((player) => player.status !== \"fold\");\r\n        game.winDesc = winners[0].descr;\r\n        // Reset Variables\r\n        solvedHands = [];\r\n        winners = [];\r\n        boardWinner = true;\r\n    }\r\n    game.players\r\n        .filter((player) => player.result > 0)\r\n        .map((player) => (player.stackAmount += player.result));\r\n}\r\nexports.solveHands = solveHands;\r\n\n\n//# sourceURL=webpack:///./src/common/game/solve-hands.ts?");

/***/ }),

/***/ "./src/common/game/start-game.ts":
/*!***************************************!*\
  !*** ./src/common/game/start-game.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst clear_table_1 = __webpack_require__(/*! ./clear-table */ \"./src/common/game/clear-table.ts\");\r\nconst clear_players_1 = __webpack_require__(/*! ../player/clear-players */ \"./src/common/player/clear-players.ts\");\r\nconst shuffle_deck_1 = __webpack_require__(/*! ../shuffle-deck */ \"./src/common/shuffle-deck.ts\");\r\nconst create_deck_1 = __webpack_require__(/*! ../create-deck */ \"./src/common/create-deck.ts\");\r\nconst update_blinds_1 = __webpack_require__(/*! ../player/update-blinds */ \"./src/common/player/update-blinds.ts\");\r\nconst update_next_dealer_1 = __webpack_require__(/*! ../player/update-next-dealer */ \"./src/common/player/update-next-dealer.ts\");\r\nconst deal_player_cards_1 = __webpack_require__(/*! ../player/deal-player-cards */ \"./src/common/player/deal-player-cards.ts\");\r\nfunction startGame(game) {\r\n    clear_table_1.clearTable(game);\r\n    clear_players_1.clearPlayers(game);\r\n    game.deck = shuffle_deck_1.shuffleDeck(create_deck_1.createDeck());\r\n    deal_player_cards_1.dealPlayerCards(game);\r\n    update_next_dealer_1.updateNextDealer(game);\r\n    update_blinds_1.updateBlinds(game);\r\n    const bigBlindIndex = game.players.findIndex((player) => player.isBigBlind === true);\r\n    if (game.players[bigBlindIndex + 1]) {\r\n        game.players[bigBlindIndex + 1].isTurn = true;\r\n    }\r\n    else {\r\n        game.players[0].isTurn = true;\r\n    }\r\n    game.currentBet = game.bigBlind;\r\n    game.currentPot = game.bigBlind + game.littleBlind;\r\n}\r\nexports.startGame = startGame;\r\n\n\n//# sourceURL=webpack:///./src/common/game/start-game.ts?");

/***/ }),

/***/ "./src/common/game/update-pot.ts":
/*!***************************************!*\
  !*** ./src/common/game/update-pot.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction updatePot(game) {\r\n    game.players\r\n        .filter((player) => player.bet !== \"\")\r\n        .map((player) => (game.pot = game.pot + parseFloat(player.bet)));\r\n}\r\nexports.updatePot = updatePot;\r\n\n\n//# sourceURL=webpack:///./src/common/game/update-pot.ts?");

/***/ }),

/***/ "./src/common/player/add-player.ts":
/*!*****************************************!*\
  !*** ./src/common/player/add-player.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst const_1 = __webpack_require__(/*! ../const */ \"./src/common/const.ts\");\r\nfunction addPlayer(game, id) {\r\n    const newPlayer = {\r\n        cards: [],\r\n        name: const_1.users.find((user) => user.userID === id).userName,\r\n        playerID: id,\r\n        stackAmount: 5.0,\r\n        isTurn: false,\r\n        dealer: false,\r\n        isLittleBlind: false,\r\n        isBigBlind: false,\r\n        status: \"\",\r\n        bet: \"\",\r\n        invested: 0,\r\n        result: 0,\r\n    };\r\n    game.players.push(newPlayer);\r\n}\r\nexports.addPlayer = addPlayer;\r\n\n\n//# sourceURL=webpack:///./src/common/player/add-player.ts?");

/***/ }),

/***/ "./src/common/player/clear-active-players.ts":
/*!***************************************************!*\
  !*** ./src/common/player/clear-active-players.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction clearActivePlayers(game) {\r\n    game.players.map((player) => {\r\n        player.bet = \"\";\r\n        if (player.status !== \"fold\") {\r\n            player.status = \"\";\r\n        }\r\n    });\r\n}\r\nexports.clearActivePlayers = clearActivePlayers;\r\n\n\n//# sourceURL=webpack:///./src/common/player/clear-active-players.ts?");

/***/ }),

/***/ "./src/common/player/clear-players.ts":
/*!********************************************!*\
  !*** ./src/common/player/clear-players.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction clearPlayers(game) {\r\n    game.players.map((player) => {\r\n        player.bet = \"\";\r\n        player.status = \"\";\r\n    });\r\n}\r\nexports.clearPlayers = clearPlayers;\r\n\n\n//# sourceURL=webpack:///./src/common/player/clear-players.ts?");

/***/ }),

/***/ "./src/common/player/deal-player-cards.ts":
/*!************************************************!*\
  !*** ./src/common/player/deal-player-cards.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction dealPlayerCards(game) {\r\n    const players = game.players;\r\n    players.map((player) => {\r\n        while (player.cards.length < 2) {\r\n            player.cards.push(game.deck.pop());\r\n        }\r\n    });\r\n}\r\nexports.dealPlayerCards = dealPlayerCards;\r\n\n\n//# sourceURL=webpack:///./src/common/player/deal-player-cards.ts?");

/***/ }),

/***/ "./src/common/player/get-game-state-players.ts":
/*!*****************************************************!*\
  !*** ./src/common/player/get-game-state-players.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction getGameStatePlayers(players, currentPlayerID, cardBack) {\r\n    const copyPlayers = players.map((player) => (Object.assign({}, player)));\r\n    copyPlayers\r\n        .filter((player) => player.playerID !== currentPlayerID && player.cards.length > 0)\r\n        .map((player) => {\r\n        player.cards = [cardBack, cardBack];\r\n    });\r\n    return copyPlayers;\r\n}\r\nexports.getGameStatePlayers = getGameStatePlayers;\r\n\n\n//# sourceURL=webpack:///./src/common/player/get-game-state-players.ts?");

/***/ }),

/***/ "./src/common/player/is-player-action.ts":
/*!***********************************************!*\
  !*** ./src/common/player/is-player-action.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction isPlayerAction(game, id) {\r\n    return game.players.filter((player) => player.playerID === id && player.isTurn === true)[0];\r\n}\r\nexports.isPlayerAction = isPlayerAction;\r\n\n\n//# sourceURL=webpack:///./src/common/player/is-player-action.ts?");

/***/ }),

/***/ "./src/common/player/next-player-turn.ts":
/*!***********************************************!*\
  !*** ./src/common/player/next-player-turn.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst start_game_1 = __webpack_require__(/*! ../game/start-game */ \"./src/common/game/start-game.ts\");\r\nconst next_round_1 = __webpack_require__(/*! ../game/next-round */ \"./src/common/game/next-round.ts\");\r\nfunction nextPlayerTurn(game) {\r\n    if (game.players.filter((player) => player.status !== \"fold\").length === 1) {\r\n        game.players\r\n            .filter((player) => player.status !== \"fold\")\r\n            .map((player) => {\r\n            player.stackAmount += game.pot + game.currentPot;\r\n        });\r\n        start_game_1.startGame(game);\r\n        return;\r\n    }\r\n    const playerIndex = game.players.findIndex((player) => player.isTurn === true);\r\n    let firstTurnIndex = game.players.findIndex((player) => player.isLittleBlind === true);\r\n    let nextPlayerIndex = playerIndex + 1;\r\n    game.players[playerIndex].isTurn = false;\r\n    while (!game.players[nextPlayerIndex] ||\r\n        game.players[nextPlayerIndex].cards.length < 1 ||\r\n        game.players[nextPlayerIndex].stackAmount === 0) {\r\n        if (!game.players[nextPlayerIndex]) {\r\n            nextPlayerIndex = 0;\r\n        }\r\n        else {\r\n            nextPlayerIndex++;\r\n        }\r\n    }\r\n    if ((game.players[nextPlayerIndex].status === \"check\" &&\r\n        game.currentBet === 0) ||\r\n        nextPlayerIndex === playerIndex ||\r\n        parseFloat(game.players[nextPlayerIndex].bet).toFixed(2) ===\r\n            game.currentBet.toFixed(2)) {\r\n        while (!game.players[firstTurnIndex] ||\r\n            game.players[firstTurnIndex].cards.length < 1 ||\r\n            game.players[firstTurnIndex].stackAmount === 0) {\r\n            if (!game.players[firstTurnIndex]) {\r\n                firstTurnIndex = 0;\r\n            }\r\n            else {\r\n                firstTurnIndex++;\r\n            }\r\n        }\r\n        game.players[firstTurnIndex].isTurn = true;\r\n        next_round_1.nextRound(game);\r\n        return;\r\n    }\r\n    game.players[nextPlayerIndex].isTurn = true;\r\n}\r\nexports.nextPlayerTurn = nextPlayerTurn;\r\n\n\n//# sourceURL=webpack:///./src/common/player/next-player-turn.ts?");

/***/ }),

/***/ "./src/common/player/player-action.ts":
/*!********************************************!*\
  !*** ./src/common/player/player-action.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst subtract_bet_from_player_stack_1 = __webpack_require__(/*! ./subtract-bet-from-player-stack */ \"./src/common/player/subtract-bet-from-player-stack.ts\");\r\nfunction playerAction(game, player, action, data) {\r\n    const dataNum = parseFloat(data);\r\n    if (data !== \"\" && isNaN(dataNum)) {\r\n        return;\r\n    }\r\n    switch (action) {\r\n        case \"fold\":\r\n            player.cards = [];\r\n            break;\r\n        case \"check\":\r\n            break;\r\n        case \"call\":\r\n            subtract_bet_from_player_stack_1.subtractBetFromPlayerStack(game, player);\r\n            game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);\r\n            player.bet = game.currentBet.toFixed(2);\r\n            break;\r\n        case \"bet\":\r\n        case \"raise\":\r\n            game.currentBet = dataNum;\r\n            subtract_bet_from_player_stack_1.subtractBetFromPlayerStack(game, player);\r\n            game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);\r\n            player.bet = parseFloat(data).toFixed(2);\r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n    player.status = action;\r\n}\r\nexports.playerAction = playerAction;\r\n\n\n//# sourceURL=webpack:///./src/common/player/player-action.ts?");

/***/ }),

/***/ "./src/common/player/subtract-bet-from-player-stack.ts":
/*!*************************************************************!*\
  !*** ./src/common/player/subtract-bet-from-player-stack.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst round_to_precision_1 = __webpack_require__(/*! ../round-to-precision */ \"./src/common/round-to-precision.ts\");\r\nfunction subtractBetFromPlayerStack(game, player) {\r\n    player.stackAmount =\r\n        round_to_precision_1.roundToPrecision(player.stackAmount, 0.01) -\r\n            (round_to_precision_1.roundToPrecision(game.currentBet, 0.01) -\r\n                round_to_precision_1.roundToPrecision(parseFloat(player.bet) || 0, 0.01));\r\n    player.invested =\r\n        round_to_precision_1.roundToPrecision(player.invested, 0.01) +\r\n            (round_to_precision_1.roundToPrecision(game.currentBet, 0.01) -\r\n                round_to_precision_1.roundToPrecision(parseFloat(player.bet) || 0, 0.01));\r\n}\r\nexports.subtractBetFromPlayerStack = subtractBetFromPlayerStack;\r\n\n\n//# sourceURL=webpack:///./src/common/player/subtract-bet-from-player-stack.ts?");

/***/ }),

/***/ "./src/common/player/update-blinds.ts":
/*!********************************************!*\
  !*** ./src/common/player/update-blinds.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction updateBlinds(game) {\r\n    const dealerIndex = game.players.findIndex((player) => player.dealer === true);\r\n    if (game.players[dealerIndex + 1]) {\r\n        game.players[dealerIndex + 1].isLittleBlind = true;\r\n        game.players[dealerIndex + 1].bet = game.littleBlind.toString();\r\n        game.players[dealerIndex + 1].stackAmount -= game.littleBlind;\r\n        game.players[dealerIndex + 1].invested += game.littleBlind;\r\n    }\r\n    else {\r\n        game.players[0].isLittleBlind = true;\r\n        game.players[0].bet = game.littleBlind.toString();\r\n        game.players[0].stackAmount -= game.littleBlind;\r\n        game.players[0].invested += game.littleBlind;\r\n    }\r\n    const littleBlindIndex = game.players.findIndex((player) => player.isLittleBlind === true);\r\n    if (game.players[littleBlindIndex + 1]) {\r\n        game.players[littleBlindIndex + 1].isBigBlind = true;\r\n        game.players[littleBlindIndex + 1].bet = game.bigBlind.toString();\r\n        game.players[littleBlindIndex + 1].stackAmount -= game.bigBlind;\r\n        game.players[littleBlindIndex + 1].invested += game.bigBlind;\r\n    }\r\n    else {\r\n        game.players[0].isBigBlind = true;\r\n        game.players[0].bet = game.bigBlind.toString();\r\n        game.players[0].stackAmount -= game.bigBlind;\r\n        game.players[0].invested += game.bigBlind;\r\n    }\r\n}\r\nexports.updateBlinds = updateBlinds;\r\n\n\n//# sourceURL=webpack:///./src/common/player/update-blinds.ts?");

/***/ }),

/***/ "./src/common/player/update-next-dealer.ts":
/*!*************************************************!*\
  !*** ./src/common/player/update-next-dealer.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction updateNextDealer(game) {\r\n    const dealerIndex = game.players.findIndex((player) => player.dealer === true);\r\n    if (dealerIndex === -1) {\r\n        game.players[0].dealer = true;\r\n        return;\r\n    }\r\n    if (game.players[dealerIndex + 1]) {\r\n        game.players[dealerIndex].dealer = false;\r\n        game.players[dealerIndex + 1].dealer = true;\r\n        return;\r\n    }\r\n    game.players[game.players.length - 1].dealer = false;\r\n    game.players[0].dealer = true;\r\n}\r\nexports.updateNextDealer = updateNextDealer;\r\n\n\n//# sourceURL=webpack:///./src/common/player/update-next-dealer.ts?");

/***/ }),

/***/ "./src/common/round-to-precision.ts":
/*!******************************************!*\
  !*** ./src/common/round-to-precision.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction roundToPrecision(x, precision) {\r\n    const y = +x + (precision === undefined ? 0.5 : precision / 2);\r\n    return y - (y % (precision === undefined ? 1 : +precision));\r\n}\r\nexports.roundToPrecision = roundToPrecision;\r\n\n\n//# sourceURL=webpack:///./src/common/round-to-precision.ts?");

/***/ }),

/***/ "./src/common/shuffle-deck.ts":
/*!************************************!*\
  !*** ./src/common/shuffle-deck.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction shuffleDeck(deck) {\r\n    const shuffledDeck = deck;\r\n    let tempCard;\r\n    for (let i = shuffledDeck.length - 1; i > 0; i--) {\r\n        const randomPos = Math.floor(Math.random() * (i + 1));\r\n        tempCard = shuffledDeck[i];\r\n        shuffledDeck[i] = shuffledDeck[randomPos];\r\n        shuffledDeck[randomPos] = tempCard;\r\n    }\r\n    return shuffledDeck;\r\n}\r\nexports.shuffleDeck = shuffleDeck;\r\n\n\n//# sourceURL=webpack:///./src/common/shuffle-deck.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\r\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nconst http_1 = __webpack_require__(/*! http */ \"http\");\r\nconst socket_1 = __webpack_require__(/*! ./socket */ \"./src/socket.ts\");\r\nconst app = express_1.default();\r\nconst port = process.env.PORT || 8080;\r\nconst server = http_1.createServer(app);\r\nsocket_1.createSocket(server);\r\napp.use(body_parser_1.default.json());\r\napp.use(body_parser_1.default.urlencoded({ extended: false }));\r\napp.use(express_1.default.static(\"./build\"));\r\napp.use(express_1.default.static(__dirname, { extensions: [\"html\"] }));\r\nserver.listen(port, () => {\r\n    // tslint:disable-next-line:no-console\r\n    console.log(`Listening at http://localhost:${port}/`);\r\n});\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/server.ts?");

/***/ }),

/***/ "./src/socket.ts":
/*!***********************!*\
  !*** ./src/socket.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst socket_io_1 = __webpack_require__(/*! socket.io */ \"socket.io\");\r\nconst uuid = __webpack_require__(/*! uuid */ \"uuid\");\r\nconst create_game_1 = __webpack_require__(/*! ./common/game/create-game */ \"./src/common/game/create-game.ts\");\r\nconst get_game_1 = __webpack_require__(/*! ./common/game/get-game */ \"./src/common/game/get-game.ts\");\r\nconst add_player_1 = __webpack_require__(/*! ./common/player/add-player */ \"./src/common/player/add-player.ts\");\r\nconst start_game_1 = __webpack_require__(/*! ./common/game/start-game */ \"./src/common/game/start-game.ts\");\r\nconst is_player_action_1 = __webpack_require__(/*! ./common/player/is-player-action */ \"./src/common/player/is-player-action.ts\");\r\nconst player_action_1 = __webpack_require__(/*! ./common/player/player-action */ \"./src/common/player/player-action.ts\");\r\nconst next_player_turn_1 = __webpack_require__(/*! ./common/player/next-player-turn */ \"./src/common/player/next-player-turn.ts\");\r\nconst get_game_state_1 = __webpack_require__(/*! ./common/game/get-game-state */ \"./src/common/game/get-game-state.ts\");\r\nconst const_1 = __webpack_require__(/*! ./common/const */ \"./src/common/const.ts\");\r\nconst_1.games.push(create_game_1.createGame());\r\nfunction createSocket(server) {\r\n    const io = socket_io_1.listen(server);\r\n    io.on(\"connection\", (socket) => {\r\n        // tslint:disable-next-line:no-console\r\n        console.log(\"Client connected...\");\r\n        socket.on(\"findOrCreatePlayer\", (userID, userName, fn) => {\r\n            if (!const_1.users.find((user) => user.userID === userID)) {\r\n                userID = uuid();\r\n                const_1.users.push({ userID, clientID: socket.id, userName });\r\n            }\r\n            else {\r\n                const_1.users\r\n                    .filter((user) => user.userID === userID)\r\n                    .map((user) => {\r\n                    try {\r\n                        io.sockets.sockets[user.clientID].disconnect();\r\n                    }\r\n                    catch (error) {\r\n                        // tslint:disable-next-line:no-console\r\n                        console.log(error);\r\n                    }\r\n                    user.clientID = socket.id;\r\n                });\r\n            }\r\n            fn(const_1.users.find((user) => user.userID === userID));\r\n        });\r\n        socket.on(\"subscribeToGame\", (gameID, userID) => {\r\n            // tslint:disable-next-line:no-console\r\n            console.log(`client is subscribing the game: ${gameID} @ ${userID}`);\r\n            socket.join(gameID);\r\n            const currentGame = get_game_1.getGame(gameID);\r\n            if (!currentGame.players.find((player) => player.playerID === userID)) {\r\n                add_player_1.addPlayer(currentGame, userID);\r\n            }\r\n            updateGameState(io, currentGame);\r\n        });\r\n        socket.on(\"startGame\", (gameID) => {\r\n            const currentGame = get_game_1.getGame(gameID);\r\n            start_game_1.startGame(currentGame);\r\n            updateGameState(io, currentGame);\r\n        });\r\n        socket.on(\"playerAction\", (gameID, userID, action, data) => {\r\n            const currentGame = get_game_1.getGame(gameID);\r\n            const player = is_player_action_1.isPlayerAction(currentGame, userID);\r\n            if (!player) {\r\n                return;\r\n            }\r\n            player_action_1.playerAction(currentGame, player, action, data);\r\n            next_player_turn_1.nextPlayerTurn(currentGame);\r\n            updateGameState(io, currentGame);\r\n            if (currentGame.winDesc !== \"\") {\r\n                setTimeout(() => {\r\n                    start_game_1.startGame(currentGame);\r\n                    updateGameState(io, currentGame);\r\n                }, 5000);\r\n            }\r\n        });\r\n    });\r\n}\r\nexports.createSocket = createSocket;\r\nfunction updateGameState(io, game) {\r\n    io.sockets.in(game.gameID).clients((err, clients) => {\r\n        clients.map((client) => {\r\n            io.to(client).emit(\"gameUpdate\", get_game_state_1.getGameState(game, const_1.users.find((user) => user.clientID === client).userID));\r\n        });\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/socket.ts?");

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