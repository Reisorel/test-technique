import { Router } from "express";
import discountController from "../controller/discountController";

const router = Router();

// Route pour calculer la remise d'un panier spécifique
router.get("/:id", discountController.getDiscountedBasket);

export default router;
