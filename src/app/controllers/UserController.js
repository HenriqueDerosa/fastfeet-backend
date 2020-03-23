import * as yup from 'yup'
import User from '../models/User'

class UserController {
  async index(req, res) {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(user)
  }

  async store(req, res) {
    const { name, email, password } = req.body

    const user = await User.create({ name, email, password })

    return res.json(user)
  }
}

export default new UserController()
