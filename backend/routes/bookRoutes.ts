import { Router } from 'express'
import bookController from '../controller/bookController'

const router = Router()

router.get('/', bookController.getAllBooks)


export default router;
