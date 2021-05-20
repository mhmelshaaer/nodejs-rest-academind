import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { OrderController } from '../controllers/order.js';

// Order router
const router = express.Router();

// Order controller
const orderController = new OrderController(); 

router.get('/', AuthMiddleware, orderController.list);
router.get('/:id', AuthMiddleware, orderController.get);
router.post('/', AuthMiddleware, orderController.store);
router.delete('/:id', AuthMiddleware, orderController.delete);

export { router as OrderRouter }
