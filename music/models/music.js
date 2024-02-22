'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Music extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'userId',
      })
    }
  }
  Music.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    musicName: DataTypes.STRING,
    artistName: DataTypes.STRING,
    genreList: DataTypes.JSON,
    publishDate: DataTypes.DATE,
    address: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Music',
  });
  return Music;
};