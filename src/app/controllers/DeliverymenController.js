import { Op } from 'sequelize'

import * as yup from 'yup'
import Deliverymen from '../models/Deliverymen'
import Order from '../models/Order'
import File from '../models/File'
import DeliverProductService from '../services/DeliverProductService'
import Recipient from '../models/Recipient'

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
      const { id, name, avatar_id } = await Deliverymen.create(req.body)

      return res.status(200).json({ id, name, email, avatar_id })
    } catch (err) {
      return res.json(err)
    }
  }

  async index(req, res) {
    const { q } = req.query

    const deliverymen = await Deliverymen.findAll({
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

  async show(req, res) {
    const { id } = req.params

    const [deliveryman] = await Deliverymen.findAll({
      where: {
        id,
      },
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url', 'path', 'name'],
        },
      ],
    })
    if (!deliveryman) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(deliveryman)
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
          canceled_at: null,
        },
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'address',
              'address2',
              'number',
              'state',
              'city',
              'zipcode',
            ],
          },
          {
            model: Deliverymen,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['url', 'path', 'name'],
              },
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['url', 'path', 'name'],
          },
        ],
        attributes: [
          'id',
          'product',
          'created_at',
          'start_date',
          'end_date',
          'canceled_at',
          'updated_at',
        ],
      })

      return res.status(200).json(orders)
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new DeliverymenController()
