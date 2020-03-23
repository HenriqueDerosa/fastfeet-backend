'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'deliveryman_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'deliverymen',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'deliveryman_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },
}
