import { isWithinInterval, parseISO, startOfHour, setHours } from 'date-fns'
import Order from '../models/Order'

class DeliverProductService {
  async run({ order_id, end_date, signature_id }) {
    const order = await Order.findByPk(order_id)

    if (!order) {
      throw new Error('Order not found')
    }

    await order.update({
      end_date,
      signature_id,
    })

    return order
  }
}

export default new DeliverProductService()
