import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

router.get("/", async (req, res) => {
res.json(await manager.getCarts());
});

router.get("/:cid", async (req, res) => {
const cart = await manager.getCartById(req.params.cid);
if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
res.json(cart);
});

router.post("/", async (req, res) => {
const newCart = await manager.createCart(req.body);
res.status(201).json(newCart);
});

router.put("/:cid", async (req, res) => {
const updated = await manager.updateCart(req.params.cid, req.body);
if (!updated) return res.status(404).json({ error: "No encontrado" });
res.json(updated);
});

router.delete("/:cid", async (req, res) => {
await manager.deleteCart(req.params.cid);
res.json({ message: "Carrito eliminado" });
});

export default router;
