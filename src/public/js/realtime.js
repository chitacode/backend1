const socket = io();

const list = document.getElementById("productList");

socket.on("products", products => {
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.id} - ${p.title} - $${p.price}`;
    list.appendChild(li);
  });
});

document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = {
    title: formData.get("title"),
    price: formData.get("price")
  };
  socket.emit("addProduct", product);
  e.target.reset();
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  const id = document.getElementById("deleteId").value;
  socket.emit("deleteProduct", id);
});
