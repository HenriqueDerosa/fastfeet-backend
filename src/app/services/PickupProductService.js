import { Op } from 'sequelize'
import {
  isWithinInterval,
  parseISO,
  startOfHour,
  setHours,
  isToday,
  parse,
} from 'date-fns'
import Order from '../models/Order'
import Recipient from '../models/Recipient'
import Deliverymen from '../models/Deliverymen'
import File from '../models/File'
import { WITHDRAW_PER_DAY } from '../utils/constants'

const availableHours = parsedDate => ({
  start: startOfHour(setHours(parsedDate, 8)),
  end: startOfHour(setHours(parsedDate, 18)),
})

class PickupProductService {
  async run({ order_id, deliveryman_id, start_date }) {
    const parsedDate = parseISO(start_date)

    // Limit dates 8am ~ 6pm
    if (!isWithinInterval(parsedDate, availableHours(parsedDate))) {
      throw new Error('Utilize datas entre 8:00 e 18:00')
    }

    // Has user picked up more than 5
    const userOrders = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [
            availableHours(parsedDate).start,
            availableHours(parsedDate).end,
          ],
        },
      },
    })

    if (userOrders.length >= WITHDRAW_PER_DAY) {
      throw new Error(
        `Hoje você já atingiu o limite de ${WITHDRAW_PER_DAY} retiradas por dia`
      )
    }

    // Update order
    const order = await Order.findByPk(order_id, {
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
        'updatedAt',
      ],
    })

    if (!order) {
      throw new Error('Encomenda não encontrada')
    }

    await order.update({
      start_date,
    })

    return order
  }
}

export default new PickupProductService()
