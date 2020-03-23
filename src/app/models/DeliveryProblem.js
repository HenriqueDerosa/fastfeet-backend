import Sequelize, { Model } from 'sequelize'

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'delivery_id',
    })
  }
}

export default DeliveryProblem
