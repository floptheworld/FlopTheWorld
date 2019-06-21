"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_api_1 = require("../common/public-api");
const router = express_1.Router();
router.get("/", (req, res) => {
    res.send(public_api_1.shuffleDeck(public_api_1.createDeck()));
});
exports.DeckController = router;
//# sourceMappingURL=deck.controller.js.map