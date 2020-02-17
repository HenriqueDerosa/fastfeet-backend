import Sequelize from 'sequelize'

import User from '../app/models/User'

import config from '../config/database'
import Recipient from '../app/models/Recipient'
import Deliverymen from '../app/models/Deliverymen'

const models = [User, Recipient, Deliverymen]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(config)

    models.map(model => model.init(this.connection))
  }
}

export default new Database()
