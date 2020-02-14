const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");

const ProductController = require("./app/controllers/ProductController");

routes.get("/", (req, res) => {
  return res.render("layout.njk");
});

// Salva os produtos
routes.get("/products/create", ProductController.create);
routes.post("/products", multer.array("photos", 6), ProductController.store);

// atualiza ou apaga os produtos
routes.get("/products/:id/edit", ProductController.edit);
routes.put("/products", multer.array("photos", 6), ProductController.update);
routes.delete("/products", ProductController.delete);

// Caminho do usuário
routes.get("/ads/create", (req, res) => {
  return res.redirect("/products/create");
});

module.exports = routes;
