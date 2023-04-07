'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tareas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Tags);
      this.hasMany(models.Comentarios);
    }
  }
  Tareas.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    estatus: DataTypes.CHAR,
    fechaEntrega: DataTypes.DATE,
    //comentarios: DataTypes.STRING,
    responsable: DataTypes.INTEGER,
    //tags: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tareas',
    timestamps: false
  });
  return Tareas;
};