import express from 'express';
import authController from '../controllers/authController.js';
import { authRESTMiddleware } from '../middlewares/authRESTMiddleware.js';
const router = express.Router()

router.get('/me', authRESTMiddleware, authController.me)
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authRESTMiddleware, authController.logout)

export default router