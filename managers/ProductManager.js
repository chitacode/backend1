import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {
constructor() {
this.filePath = path.join(__dirname, "../data/products.json");
}

async getProducts() {
const data = await fs.promises.readFile(this.filePath, "utf-8");
return JSON.parse(data);
}

async getProductById(id) {
const products = await this.getProducts();
return products.find((p) => p.id === id);
}

async addProduct(product) {
const products = await this.getProducts();
const newProduct = { id: String(Date.now()), ...product };
products.push(newProduct);
await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
return newProduct;
}

async updateProduct(id, updatedFields) {
const products = await this.getProducts();
const index = products.findIndex((p) => p.id === id);
if (index === -1) return null;

```
products[index] = { ...products[index], ...updatedFields };
await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
return products[index];
```

}

async deleteProduct(id) {
let products = await this.getProducts();
products = products.filter((p) => p.id !== id);
await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
}
}
