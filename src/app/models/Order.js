import Sequelize, { Model } from 'sequelize'

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        deliveryman_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
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
  }
}

export default Order
