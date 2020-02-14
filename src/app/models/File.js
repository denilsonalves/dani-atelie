const { Sequelize, Model } = require("sequelize");

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        filename: Sequelize.STRING,
        path: Sequelize.STRING,
        product_id: Sequelize.INTEGER
      },
      {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        tableName: "File"
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignkey: "product_id", as: "product" });
  }
}
module.exports = File;
