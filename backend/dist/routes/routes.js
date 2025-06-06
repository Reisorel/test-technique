"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = __importDefault(require("../controller/bookController"));
const router = (0, express_1.Router)();
router.use('/', bookController_1.default.getAllBooks);
exports.default = router;
