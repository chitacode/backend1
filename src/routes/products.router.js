import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      lean: true
    };

    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    const result = await ProductModel.paginate(filter, options);

    const baseUrl = req.baseUrl;
    const makeLink = p =>
      `${baseUrl}?limit=${limit}&page=${p}&sort=${sort || ""}&query=${query || ""}`;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
    });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();
  if (!product) return res.status(404).json({ error: "not found" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const created = await ProductModel.create(req.body);
  req.io.emit("productsUpdated");
  res.json(created);
});

router.put("/:pid", async (req, res) => {
  const updated = await ProductModel.findByIdAndUpdate(
    req.params.pid,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:pid", async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.pid);
  req.io.emit("productsUpdated");
  res.json({ status: "deleted" });
});

export default router;
