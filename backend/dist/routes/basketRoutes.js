"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basketController_1 = __importDefault(require("../controller/basketController"));
const router = (0, express_1.Router)();
router.get("/", basketController_1.default.getAllBaskets);
router.get("/:id", basketController_1.default.getBasketById);
router.post("/:id", basketController_1.default.addNewBookToBasket);
router.delete('/:id/books/:bookId', basketController_1.default.decreaseBookQuantity);
exports.default = router;
