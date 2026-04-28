const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('userns', 'admin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    })

    await queryInterface.addColumn('userns', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('userns', 'admin')
    await queryInterface.removeColumn('userns', 'disabled')
  },
}
