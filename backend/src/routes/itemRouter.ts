import express from 'express';
import itemController from '../controllers/itemController.js';
const router = express.Router()

router.get('/:type', itemController.getItems)

export default router