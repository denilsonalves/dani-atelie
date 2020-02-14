const { Sequelize } = require("sequelize");

const Category = require("../app/models/Category");
const Product = require("../app/models/Product");
const File = require("../app/models/File");

const models = [Category, File, Product];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize("daniteste", "postgres", "docker", {
      host: "localhost",
      port: 5432,
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
      },
      query: {
        raw: true
      }
    });

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();
