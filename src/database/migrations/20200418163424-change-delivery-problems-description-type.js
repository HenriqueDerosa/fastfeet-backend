'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('delivery_problems', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('delivery_problems', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },
}
