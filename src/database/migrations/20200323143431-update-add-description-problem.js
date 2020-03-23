'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_problems', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('delivery_problems', 'description')
  },
}
