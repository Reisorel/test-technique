"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookRoutes_1 = __importDefault(require("./bookRoutes"));
const basketRoutes_1 = __importDefault(require("./basketRoutes"));
const router = (0, express_1.Router)();
router.use('/books', bookRoutes_1.default);
router.use('/baskets', basketRoutes_1.default);
exports.default = router;
