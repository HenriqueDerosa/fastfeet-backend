import { Op } from 'sequelize'
import * as yup from 'yup'
import Order from '../models/Order'
import { PER_PAGE } from '../utils/constants'
import Recipient from '../models/Recipient'
import Deliverymen from '../models/Deliverymen'
import File from '../models/File'

import Queue from '../../lib/Queue'
import CancellationMail from '../jobs/CancellationMail'
import CreationMail from '../jobs/CreationMail'
import PickupProductService from '../services/PickupProductService'
import DeliverProductService from '../services/DeliverProductService'

class OrdersController {
  async store(req, res) {
    try {
      const order = await Order.create(req.body)

      await order.reload({
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
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
        ],
      })

      await Queue.add(CreationMail.key, {
        order,
      })

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
      ],
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'updatedAt',
        'signature_id',
      ],
    })

    return res.status(200).json(orders)
  }

  // updates values of specified order
  async update(req, res) {
    const { id } = req.params

    const order = await Order.findByPk(id, {
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
      ],
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'updatedAt',
        'signature_id',
      ],
    })

    if (!order) {
      return res.status(404).json({ error: 'Order does not exists.' })
    }

    const {
      product,
      recipient,
      deliveryman,
      start_date,
      end_date,
      canceled_at,
    } = req.body

    if (product) order.product = product
    if (recipient) order.recipient_id = recipient
    if (deliveryman) order.deliveryman_id = deliveryman
    if (start_date) order.start_date = start_date
    if (end_date) order.end_date = end_date
    if (canceled_at) {
      console.log('cancelled', order.id)
      order.canceled_at = new Date()
      await Queue.add(CancellationMail.key, {
        order,
      })
    }

    const newOrder = await order.save()

    return res.json(newOrder)
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

      return res.status(204).send()
    } catch (err) {
      return res.json({ error: err })
    }
  }

  async pickup(req, res) {
    const { id } = req.params
    const { start_date } = req.body

    const pickedUp = await PickupProductService.run({
      order_id: id,
      start_date,
    })

    return res.json(pickedUp)
  }

  async deliver(req, res) {
    const { id } = req.params
    const { end_date, signature_id } = req.body

    const deliveredProduct = await DeliverProductService.run({
      order_id: id,
      end_date,
      signature_id,
    })

    return res.json(deliveredProduct)
  }
}

export default new OrdersController()
