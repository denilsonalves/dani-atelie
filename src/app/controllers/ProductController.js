const { formatAmount } = require("../../lib/utils");
const fs = require("fs");

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  async create(req, res) {
    let categories = await Category.findAll();
    return res.render("products/create.njk", { categories });
  },

  async store(req, res) {
    const keys = Object.keys(req.body);
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    if (req.files.length == 0) {
      return res.send("Please, send at least one image");
    }

    req.body.price = req.body.price.replace(/\D/g, "");

    if (req.body.status == null) {
      req.body.status = 1;
    }
    if (req.body.old_price == null) {
      req.body.old_price = req.body.price;
    }

    const productId = await Product.create(req.body);

    // await não funciona com map, alternativa é usar Promise
    const filesPromise = req.files.map(file =>
      File.create({ ...file, product_id: productId.id })
    );
    await Promise.all(filesPromise);
    /* await req.files.map(file =>
      File.create({ ...file, product_id: productId.id })
    ); */

    return res.redirect(`products/${productId.id}/edit`);
  },

  async edit(req, res) {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.send("Product not found!");

    product.old_price = formatAmount(product.old_price);
    product.price = formatAmount(product.price);

    // get categorias
    const categories = await Category.findAll();

    // get images of the products
    let files = await File.findAll({ where: { productId: product.id } });

    files = files.map(file => ({
      ...file,
      path: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("products/edit.njk", { product, categories, files });
  },

  async update(req, res) {
    const keys = Object.keys(req.body);
    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send("Please, fill all fields!");
      }
    }

    if (req.body.removed_files) {
      // criando um array dos ids selecionadas para remoção
      const removedFiles = req.body.removed_files.split(",");
      // pega a última posição que é vazia
      const lastIndex = removedFiles.length - 1;
      //remove a última posição do array
      removedFiles.splice(lastIndex, 1);

      let files = await File.findAll({
        where: { productId: req.body.id },
        attributes: ["id", "path"]
      });

      for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < removedFiles.length; j++) {
          if (files[i].id == removedFiles[j]) {
            // console.log("path");
            // console.log(files[i].path);
            fs.unlinkSync(files[i].path);
            // console.log("id");
            // console.log(files[i].id);
            File.destroy({ where: { id: files[i].id } });
          }
        }
      }
    }

    req.body.price = req.body.price.replace(/\D/g, "");

    if (req.body.old_price != req.body.price) {
      const oldProduct = await Product.findByPk(req.body.id);
      req.body.old_price = oldProduct.price;
    }

    await Product.update(req.body, { where: { id: req.body.id } });

    return res.redirect(`/products/${req.body.id}/edit`);
  },

  async delete(req, res) {
    await Product.destroy(req.body.id);

    return res.redirect("/products/create");
  }
};
