import * as yup from 'yup'
import Order from '../models/Order'

class OrdersController {
  async store(req, res) {
    const schema = yup.object().shape({
      recipient_id: yup.number(),
      deliveryman_id: yup.number(),
      start_date: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You must send recipient_id, deliveryman_id, start_date',
      })
    }

    try {
      const order = await Order.create(req.body)

      return res.status(200).json(order)
    } catch (err) {
      return res.json(err)
    }
  }

  async index(req, res) {
    const orders = await Order.findAll()

    return res.status(200).json(orders)
  }

  async update(req, res) {
    const { id } = req.params

    const courier = await Order.findByPk(id)

    if (!courier) {
      return res.status(404).json({ error: 'Order does not exists.' })
    }

    const { name, email } = await Order.update(req.body)

    return res.json({ id, name, email })
  }

  async delete(req, res) {
    const { id } = req.params

    const courier = await Order.findByPk(id)

    if (!courier) {
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
