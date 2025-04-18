import { Router } from 'express'
import bookRoutes from "./bookRoutes"
import basketRoutes from "./basketRoutes"
import discountRoutes from "./discountRoutes"

const router = Router();

router.use('/books', bookRoutes);
router.use('/baskets', basketRoutes)
router.use('/discounts', discountRoutes)

export default router
