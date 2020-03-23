import { Op } from 'sequelize'
import * as yup from 'yup'
import Order from '../models/Order'

class OrdersController {
  // creates a new order using recipient_id and deliveryman_id
  async store(req, res) {
    const schema = yup.object().shape({
      recipient_id: yup.number(),
      deliveryman_id: yup.number(),
      product: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    try {
      const order = await Order.create(req.body)

      return res.status(200).json(order)
    } catch (err) {
      return res.json(err)
    }
  }

  // lists all orders
  async index(req, res) {
    const { page = 1, q } = req.query

    const filter = q && {
      product: {
        [Op.iLike]: `%${q}%`,
      },
    }

    const orders = await Order.findAll({
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
      where: {
        canceled_at: null,
        end_date: null,
        ...filter,
      },
    })

    return res.status(200).json(orders)
  }

  // updates values of specified order
  async update(req, res) {
    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ error: 'Order does not exists.' })
    }

    const { name, email } = await Order.update(req.body)

    return res.json({ id, name, email })
  }

  // delete specified order
  async delete(req, res) {
    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ error: 'Order does not exists' })
    }

    try {
      await Order.destroy({ where: { id } })
      return res.status(200).json({
        status: `courier '${courier.name}' has been sucessfuly removed`,
      })
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new OrdersController()
