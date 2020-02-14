import Sequelize, { Model } from 'sequelize'

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        address2: Sequelize.STRING,
        number: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipcode: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Recipient
