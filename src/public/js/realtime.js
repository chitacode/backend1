const socket = io();

const list = document.getElementById("list");
const form = document.getElementById("addForm");

async function load() {
  const res = await fetch("/api/products");
  const data = await res.json();
  render(data.payload || data);
}

function render(products) {
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.title} — $${p.price}
      <button onclick="del('${p._id}')">X</button>
    `;
    list.appendChild(li);
  });
}

form.onsubmit = e => {
  e.preventDefault();
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());
  obj.price = Number(obj.price);
  obj.stock = Number(obj.stock);
  socket.emit("addProduct", obj);
  form.reset();
};

function del(id) {
  socket.emit("deleteProduct", id);
}

socket.on("productsUpdated", load);

load();

socket.on("productError", msg => {
  alert(msg);
});
