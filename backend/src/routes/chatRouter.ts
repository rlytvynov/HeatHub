import express from 'express';
import chatController from '../controllers/chatController.js';
import { authRESTMiddleware } from '../middlewares/authRESTMiddleware.js';
const router = express.Router()

router.get('/room', authRESTMiddleware, chatController.getMyRoom)
router.get('/rooms', chatController.getRooms)
router.get('/rooms/:roomId', chatController.getRoomById)

export default router