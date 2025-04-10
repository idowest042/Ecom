import express from 'express';
import { addToCart, updateCart, getUserCart, deleteFromCart } from '../controllers/cartController.js';
import { authUser } from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart);
cartRouter.put('/update', authUser, updateCart);
cartRouter.post('/get', authUser, getUserCart);
cartRouter.delete('/delete', authUser, deleteFromCart);

export default cartRouter;