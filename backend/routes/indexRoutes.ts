import { Router } from 'express'
import bookRoutes from "./bookRoutes"
import basketRoutes from "./basketRoutes"

const router = Router();

router.use('/books', bookRoutes);
router.use('/baskets', basketRoutes)

export default router
