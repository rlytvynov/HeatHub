import express from 'express';
import cartController from '../controllers/cartController.js';
import { authRESTMiddleware } from '../middlewares/authRESTMiddleware.js';
const router = express.Router()

router.get('/', authRESTMiddleware, cartController.getItems)
router.put('/', authRESTMiddleware, cartController.updateCart)


export default router