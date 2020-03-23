import { isWithinInterval, parseISO, startOfHour, setHours } from 'date-fns'
import Order from '../models/Order'

class PickupProductService {
  async run({ order_id, start_date }) {
    const parsedDate = parseISO(start_date)

    if (
      !isWithinInterval(parsedDate, {
        start: startOfHour(setHours(parsedDate, 8)),
        end: startOfHour(setHours(parsedDate, 18)),
      })
    ) {
      throw new Error('You must use dates between 8am to 6pm')
    }

    const order = await Order.findByPk(order_id)

    if (!order) {
      throw new Error('Order not found')
    }

    await order.update({
      start_date,
    })

    return order
  }
}

export default new PickupProductService()
