"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discountController_1 = __importDefault(require("../controller/discountController"));
const router = (0, express_1.Router)();
// Route pour calculer la remise d'un panier spécifique
router.get("/:id", discountController_1.default.getDiscountedBasket);
exports.default = router;
