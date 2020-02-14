const { Sequelize, Model } = require("sequelize");

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        old_price: Sequelize.DECIMAL,
        price: Sequelize.DECIMAL,
        quantity: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
        category_id: Sequelize.INTEGER
      },
      {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        tableName: "Product"
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignkey: "category_id"
    });
  }

  static associate(models) {
    this.hasMany(models.File, {
      as: "files"
    });
  }

  // static associate(models) {
  //   this.hasmany(models.File, {
  //     as: "files"
  //   });
  // }
}
module.exports = Product;
