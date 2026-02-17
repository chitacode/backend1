import { Router } from "express";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.json(cart);
});

router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  if (!cart) return res.status(404).json({ error: "not found" });
  res.json(cart);
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);

  const item = cart.products.find(p => p.product.toString() === pid);

  if (item) item.quantity++;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  res.json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);

  cart.products = cart.products.filter(
    p => p.product.toString() !== pid
  );

  await cart.save();
  res.json(cart);
});

router.put("/:cid", async (req, res) => {
  const updated = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products: req.body.products },
    { new: true }
  );
  res.json(updated);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await CartModel.findById(cid);
  const item = cart.products.find(p => p.product.toString() === pid);

  if (item) item.quantity = quantity;

  await cart.save();
  res.json(cart);
});

router.delete("/:cid", async (req, res) => {
  const cart = await CartModel.findById(cid);
  cart.products = [];
  await cart.save();
  res.json(cart);
});

export default router;
