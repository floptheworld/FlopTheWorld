"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get("/", (req, res) => {
    res.send("Hello, World!");
});
router.get("/:name", (req, res) => {
    const { name } = req.params;
    res.send(`Hello, ${name}`);
});
exports.WelcomeController = router;
