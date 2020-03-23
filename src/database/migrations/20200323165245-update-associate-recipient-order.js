'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'recipient_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'recipients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'recipient_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },
}
