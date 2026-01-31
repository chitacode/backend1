import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager("./src/data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/home", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  await productManager.addProduct(req.body);
  const products = await productManager.getProducts();
  io.emit("products", products);
  res.json({ status: "ok" });
});

app.delete("/api/products/:id", async (req, res) => {
  await productManager.deleteProduct(req.params.id);
  const products = await productManager.getProducts();
  io.emit("products", products);
  res.json({ status: "ok" });
});

io.on("connection", async socket => {
  const products = await productManager.getProducts();
  socket.emit("products", products);

  socket.on("addProduct", async product => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit("products", products);
  });

  socket.on("deleteProduct", async id => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit("products", products);
  });
});

server.listen(8080, () => {
  console.log("Servidor en puerto 8080");
});
