import { Router } from "express";
import basketController from "../controller/basketController";

const router = Router();

router.get("/", basketController.getAllBaskets);
router.get("/:id", basketController.getBasketById);
router.post("/:id", basketController.addNewBookToBasket);
router.delete("/:id", basketController.deleteBookFromBasket);

export default router;
