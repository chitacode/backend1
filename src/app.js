import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";

import { connectMongo } from "./config/mongo.js";
import { ProductModel } from "./models/product.model.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

await connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", socket => {
  console.log("cliente conectado");

  socket.on("addProduct", async data => {
    try {
      data.price = Number(data.price);
      data.stock = Number(data.stock);

      if (Number.isNaN(data.price) || Number.isNaN(data.stock)) {
        socket.emit("productError", "price y stock deben ser números");
        return;
      }

      await ProductModel.create(data);
      io.emit("productsUpdated");
    } catch (e) {
      socket.emit("productError", "error creando producto");
    }
  });

  socket.on("deleteProduct", async id => {
    try {
      await ProductModel.findByIdAndDelete(id);
      io.emit("productsUpdated");
    } catch (e) {
      socket.emit("productError", "error eliminando producto");
    }
  });
});

server.listen(8080, () => {
  console.log("Servidor en puerto 8080");
});
