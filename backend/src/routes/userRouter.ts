import express from 'express';
import userController from '../controllers/userController.js';
import { authRESTMiddleware } from '../middlewares/authRESTMiddleware.js';
const router = express.Router()

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.put('/:id', authRESTMiddleware ,userController.updateUserById)
router.delete('/:id', authRESTMiddleware, userController.deleteUserById)

export default router