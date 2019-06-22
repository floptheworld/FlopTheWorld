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

/***/ "./src/common/public-api.ts":
/*!**********************************!*\
  !*** ./src/common/public-api.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst suits = new Set([\"H\", \"S\", \"C\", \"D\"]);\r\nconst numbers = new Set([\r\n    \"A\",\r\n    \"2\",\r\n    \"3\",\r\n    \"4\",\r\n    \"5\",\r\n    \"6\",\r\n    \"7\",\r\n    \"8\",\r\n    \"9\",\r\n    \"10\",\r\n    \"J\",\r\n    \"Q\",\r\n    \"K\"\r\n]);\r\nfunction createDeck() {\r\n    const cards = new Array();\r\n    suits.forEach(suit => {\r\n        numbers.forEach(num => {\r\n            cards.push(num + suit);\r\n        });\r\n    });\r\n    return cards;\r\n}\r\nexports.createDeck = createDeck;\r\nfunction shuffleDeck(deck) {\r\n    const shuffledDeck = deck;\r\n    let tempCard;\r\n    for (let i = shuffledDeck.length - 1; i > 0; i--) {\r\n        const randomPos = Math.floor(Math.random() * (i + 1));\r\n        tempCard = shuffledDeck[i];\r\n        shuffledDeck[i] = shuffledDeck[randomPos];\r\n        shuffledDeck[randomPos] = tempCard;\r\n    }\r\n    return shuffledDeck;\r\n}\r\nexports.shuffleDeck = shuffleDeck;\r\nfunction redeal(game) {\r\n    const players = game.players;\r\n    players.map(player => {\r\n        while (player.cards.length > 0) {\r\n            player.cards.pop();\r\n        }\r\n    });\r\n    game.deck = shuffleDeck(createDeck());\r\n    dealCards(game);\r\n}\r\nexports.redeal = redeal;\r\nfunction dealCards(game) {\r\n    const players = game.players;\r\n    players.map(player => {\r\n        while (player.cards.length < 2) {\r\n            player.cards.push(game.deck.pop());\r\n        }\r\n    });\r\n}\r\nexports.dealCards = dealCards;\r\n\n\n//# sourceURL=webpack:///./src/common/public-api.ts?");

/***/ }),

/***/ "./src/controllers/deck.controller.ts":
/*!********************************************!*\
  !*** ./src/controllers/deck.controller.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst express_1 = __webpack_require__(/*! express */ \"express\");\r\nconst public_api_1 = __webpack_require__(/*! ../common/public-api */ \"./src/common/public-api.ts\");\r\nconst router = express_1.Router();\r\nrouter.get(\"/\", (req, res) => {\r\n    res.send(public_api_1.shuffleDeck(public_api_1.createDeck()));\r\n});\r\nexports.DeckController = router;\r\n\n\n//# sourceURL=webpack:///./src/controllers/deck.controller.ts?");

/***/ }),

/***/ "./src/controllers/index.ts":
/*!**********************************!*\
  !*** ./src/controllers/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst express_1 = __webpack_require__(/*! express */ \"express\");\r\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nconst router = express_1.Router();\r\nrouter.get(\"/\", (req, res) => {\r\n    res.sendFile(\"index.html\", { root: path_1.default.dirname(__dirname) });\r\n    // res.send(\"Hello World\");\r\n});\r\nexports.IndexController = router;\r\n__export(__webpack_require__(/*! ./deck.controller */ \"./src/controllers/deck.controller.ts\"));\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/controllers/index.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\r\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nconst http_1 = __webpack_require__(/*! http */ \"http\");\r\nconst socket_io_1 = __webpack_require__(/*! socket.io */ \"socket.io\");\r\nconst public_api_1 = __webpack_require__(/*! ./common/public-api */ \"./src/common/public-api.ts\");\r\nconst controllers_1 = __webpack_require__(/*! ./controllers */ \"./src/controllers/index.ts\");\r\nconst app = express_1.default();\r\nconst port = process.env.PORT || 3000;\r\nconst server = http_1.createServer(app);\r\nconst io = socket_io_1.listen(server);\r\nconst games = [];\r\napp.use(body_parser_1.default.json());\r\napp.use(body_parser_1.default.urlencoded({ extended: false }));\r\napp.use(express_1.default.static(\"./build\"));\r\napp.use(\"/deck\", controllers_1.DeckController);\r\napp.use(express_1.default.static(__dirname, { extensions: [\"html\"] }));\r\nserver.listen(port, () => {\r\n    // tslint:disable-next-line:no-console\r\n    console.log(`Listening at http://localhost:${port}/`);\r\n});\r\nio.on(\"connection\", socket => {\r\n    // tslint:disable-next-line:no-console\r\n    console.log(\"Client connected..\", socket);\r\n    socket.on(\"subscribeToGame\", interval => {\r\n        // tslint:disable-next-line:no-console\r\n        console.log(\"client is subscribing to timer with interval \", interval);\r\n        const players = [\r\n            { name: \"zack\", cards: [] },\r\n            { name: \"zack\", cards: [] },\r\n            { name: \"zack\", cards: [] },\r\n            { name: \"zack\", cards: [] }\r\n        ];\r\n        const game = {\r\n            deck: public_api_1.shuffleDeck(public_api_1.createDeck()),\r\n            gameID: \"asdf1234\",\r\n            players,\r\n            time: new Date().toString()\r\n        };\r\n        public_api_1.dealCards(game);\r\n        socket.emit(\"gameUpdate\", game);\r\n    });\r\n    socket.on(\"redeal\", game => {\r\n        public_api_1.redeal(game);\r\n        socket.emit(\"gameUpdate\", game);\r\n    });\r\n});\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/server.ts?");

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

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ })

/******/ });