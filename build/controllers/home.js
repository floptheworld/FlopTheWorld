"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./welcome"));
const express_1 = require("express");
const router = express_1.Router();
router.get("/", (req, res) => {
    res.send("Hello World");
});
exports.HomeController = router;
