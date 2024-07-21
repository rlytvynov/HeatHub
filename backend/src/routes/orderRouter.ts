import express from 'express';
import { authRESTMiddleware } from '../middlewares/authRESTMiddleware.js';
import orderController from '../controllers/orderController.js';
const router = express.Router()

router.get('/', authRESTMiddleware, orderController.getOrders)
router.post('/', authRESTMiddleware, orderController.createOrder)

export default router