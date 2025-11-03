import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
res.json(await manager.getProducts());
});

router.get("/", async (req, res) => {
const product = await manager.getProductById(req.params.pid);
if (!product) return res.status(404).json({ error: "Producto no encontrado" });
res.json(product);
});

router.post("/", async (req, res) => {
const newProduct = await manager.addProduct(req.body);
res.status(201).json(newProduct);
});

router.put("/", async (req, res) => {
const updated = await manager.updateProduct(req.params.pid, req.body);
if (!updated) return res.status(404).json({ error: "No encontrado" });
res.json(updated);
});

router.delete("/", async (req, res) => {
await manager.deleteProduct(req.params.pid);
res.json({ message: "Producto eliminado" });
});

export default router;