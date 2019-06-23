"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = express_1.Router();
router.get("/", (req, res) => {
    res.sendFile("index.html", { root: path_1.default.dirname(__dirname) });
    // res.send("Hello World");
});
exports.IndexController = router;
__export(require("./deck.controller"));
//# sourceMappingURL=index.js.map