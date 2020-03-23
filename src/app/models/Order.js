import Sequelize, { Model } from 'sequelize'

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        canceled_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
    })
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    })
    this.belongsTo(models.Deliverymen, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    })
  }
}

export default Order
