const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    try {
      await queryInterface.dropTable('sessions')
    } catch {
      // If sessions does not exist yet, continue and create it.
    }

    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')

    await queryInterface.createTable('sessions', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    })
  },
}
