import User from '../models/User'

class UserController {
  async index(req, res) {
    const user = await User.findByPk(1)
    if (!user) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(user)
  }

  async store(req, res) {
    const { name, email, password } = req.body
    console.log(password)
    const user = await User.create({ name, email, password })

    return res.json({ status: 'user has been created', user })
  }
}

export default new UserController()
