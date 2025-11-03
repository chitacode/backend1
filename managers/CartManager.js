import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CartManager {
constructor() {
this.filePath = path.join(__dirname, "../data/carts.json");
}

async getCarts() {
const data = await fs.promises.readFile(this.filePath, "utf-8");
return JSON.parse(data);
}

async getCartById(id) {
const carts = await this.getCarts();
return carts.find((c) => c.id === id);
}

async createCart() {
const carts = await this.getCarts();
const newCart = { id: String(Date.now()), products: [] };
carts.push(newCart);
await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
return newCart;
}

async addProductToCart(cartId, productId) {
const carts = await this.getCarts();
const cart = carts.find((c) => c.id === cartId);
if (!cart) return null;


const existingProduct = cart.products.find((p) => p.product === productId);
if (existingProduct) {
  existingProduct.quantity += 1;
} else {
  cart.products.push({ product: productId, quantity: 1 });
}

await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
return cart;

}
}
