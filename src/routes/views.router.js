import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.get("/products", async (req, res) => {
  const result = await ProductModel.paginate({}, { limit: 10, page: 1, lean: true });
  res.render("products", { products: result.docs });
});

router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();
  res.render("productDetail", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", { cart });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeProducts");
});

export default router;
