const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    usern_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'userns', key: 'id' },
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'note' },
)

module.exports = Note
