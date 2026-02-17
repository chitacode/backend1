import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: String,
  status: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("products", productSchema);
