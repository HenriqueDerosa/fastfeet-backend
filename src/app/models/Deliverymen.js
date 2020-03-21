import Sequelize, { Model } from 'sequelize'

class Deliverymen extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'deliverymen',
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'avatar_id',
    })
  }
}

export default Deliverymen
