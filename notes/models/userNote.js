const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')
const { User } = require('../../models')

class UserNotes extends Model {}

UserNotes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usernId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'userns', key: 'id' },
    },
    noteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'notes', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user_notes',
  },
)

module.exports = UserNotes
