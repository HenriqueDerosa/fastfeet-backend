import { isWithinInterval, setHours, startOfHour, parseISO } from 'date-fns'

import * as yup from 'yup'
import Deliverymen from '../models/Deliverymen'
import Order from '../models/Order'

class DeliverymenController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    const { email } = req.body

    const existentDeliverymen = await Deliverymen.findOne({ where: { email } })

    if (existentDeliverymen) {
      return res.status(400).json({
        error: 'There is already a deliveryman with the email provided',
      })
    }

    try {
      const { id, name } = await Deliverymen.create(req.body)

      return res.status(200).json({ id, name, email })
    } catch (err) {
      return res.json(err)
    }
  }

  async index(req, res) {
    const deliverymen = await Deliverymen.findAll()

    return res.status(200).json(deliverymen)
  }

  async update(req, res) {
    const { id } = req.params

    const deliveryman = await Deliverymen.findByPk(id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveyman does not exists.' })
    }

    const { name, email, avatar_id } = await deliveryman.update(req.body)

    return res.json({ name, email, avatar_id })
  }

  async delete(req, res) {
    const { id } = req.params

    const deliveryman = await Deliverymen.findByPk(id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman does not exists' })
    }

    try {
      await Deliverymen.destroy({ where: { id } })
      return res.status(200).json({
        status: `deliveryman '${deliveryman.name}' has been sucessfuly removed`,
      })
    } catch (err) {
      return res.json(err)
    }
  }

  async orders(req, res) {
    const { id } = req.params

    try {
      const orders = await Order.findAll({
        where: {
          deliveryman_id: id,
        },
      })

      return res.status(200).json(orders)
    } catch (err) {
      return res.json(err)
    }
  }

  /* Update order (order_id)
    Pick up to deliver (sending start_date)
    Deliver (sending end_date + signature_id)
  */
  async updateOrder(req, res) {
    const { id } = req.params
    const { order_id, start_date, end_date, signature_id } = req.body

    const schema = yup.object().shape({
      order_id: yup.number().required(),
      start_date: yup.date(),
      end_date: yup.date(),
      signature_id: yup
        .number()
        .when('end_date', (end_date, signature) =>
          end_date ? signature.required() : signature
        ),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    if (start_date) {
      const parsedDate = parseISO(start_date)

      if (
        !isWithinInterval(parsedDate, {
          start: startOfHour(setHours(parsedDate, 8)),
          end: startOfHour(setHours(parsedDate, 18)),
        })
      ) {
        return res
          .status(400)
          .json({ error: 'You must use dates between 8am to 6pm' })
      }
    }

    const deliveryman = await Deliverymen.findByPk(id)
    const order = await Order.findByPk(order_id)

    if (!deliveryman || !order) {
      return res.status(404).json({ error: 'Not found' })
    }

    try {
      const data = start_date
        ? {
            start_date,
            end_date: null,
          }
        : {
            end_date,
            signature_id,
          }

      const updatedOrder = await order.update(data)

      return res.status(200).json(updatedOrder)
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new DeliverymenController()
