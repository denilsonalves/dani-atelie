const { Sequelize, Model } = require("sequelize");

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING
      },
      {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        tableName: "Category"
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Product, { as: "product" });
  }
  // Category.associate = function(models) {
  //   Category.hasMany(models.Product, { as: "product" });
}
module.exports = Category;
