const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");
const app = express();
const port = 3001;

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});


app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const product = {
    name,
    price,
    id: randomUUID(),
  };

  products.push(product);

  productFile();

  return res.json(product);
});

app.get("/products", (req, res) => {
  return res.json(products);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === id);

  return res.json(product);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  productFile();

  return res.json({ message: "Produto alterado com sucesso!" });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((product) => product.id === id);

  products.splice(productIndex, 1);

  return res.json({ message: "Produto removido com sucesso!" });
});

function productFile() {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Produto inserido com sucesso!");
    }
  });
}

app.listen(port, () => console.log(`Server is running on port ${port}!`));
