import { Op } from 'sequelize'
import { isWithinInterval, setHours, startOfHour, parseISO } from 'date-fns'

import * as yup from 'yup'
import Deliverymen from '../models/Deliverymen'
import Order from '../models/Order'
import { PER_PAGE } from '../utils/constants'
import File from '../models/File'
import DeliverProductService from '../services/DeliverProductService'

class DeliverymenController {
  async store(req, res) {
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
    const { page = 1, q } = req.query

    const deliverymen = await Deliverymen.findAll({
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
      where: q && {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url', 'path', 'name'],
        },
      ],
    })

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
      return res.status(204).send()
    } catch (err) {
      return res.json(err)
    }
  }

  /* list orders for specified deliveryman */
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
}

export default new DeliverymenController()
