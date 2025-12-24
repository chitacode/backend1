import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cm = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
  res.status(201).json(await cm.createCart());
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cm.addProductToCart(req.params.cid, req.params.pid);
  cart ? res.json(cart) : res.status(404).send('Carrito no encontrado');
});

export default router;
