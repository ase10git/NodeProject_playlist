'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genres extends Model {
    static associate(models) {
      
    }
  }
  Genres.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    genreName: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Genres',
  });
  return Genres;
};