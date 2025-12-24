import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  res.json(await pm.getProducts());
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

router.post('/', async (req, res) => {
  const product = await pm.addProduct(req.body);
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', async (req, res) => {
  await pm.deleteProduct(req.params.pid);
  res.send('Producto eliminado');
});

export default router;
