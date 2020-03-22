import Sequelize from 'sequelize'

import User from '../app/models/User'

import config from '../config/database'
import Recipient from '../app/models/Recipient'
import Deliverymen from '../app/models/Deliverymen'
import File from '../app/models/File'
import Order from '../app/models/Order'

const models = [User, Recipient, Deliverymen, File, Order]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(config)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
