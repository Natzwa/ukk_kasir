'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.transaksi, {
        foreignKey: "id_transaksi",
        as: "detail"
      })
      this.belongsTo(models.menu, {
        foreignKey: "id_menu",
        as: "menu"
      })
    }
  }    
  detail_transaksi.init({
    id_detail_transaksi:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_transaksi: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    harga: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi',
  });
  return detail_transaksi;
};