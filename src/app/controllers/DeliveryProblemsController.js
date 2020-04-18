import * as yup from 'yup'
import DeliveryProblem from '../models/DeliveryProblem'
import Order from '../models/Order'
import Queue from '../../lib/Queue'
import CancellationMail from '../jobs/CancellationMail'

class DeliveryProblemsController {
  // list all orders with problems
  async index(req, res) {
    const { id: delivery_id } = req.params

    const problems = await DeliveryProblem.findAll({
      where: delivery_id && {
        id: delivery_id,
      },
    })
    if (!problems) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(problems)
  }

  // list problems of a specific order
  async show(req, res) {
    const { id: delivery_id } = req.params

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id,
      },
      attributes: ['id', 'description', 'created_at'],
    })
    if (!problems) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(problems)
  }

  async store(req, res) {
    const { id: delivery_id } = req.params
    const { description } = req.body

    try {
      const problem = await DeliveryProblem.create({
        delivery_id,
        description,
      })
      return res.json(problem)
    } catch (err) {
      return res.json({ error: err })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    const problem = await DeliveryProblem.findByPk(id)

    const order = await Order.findByPk(problem.delivery_id)

    order.canceled_at = new Date()
    await Queue.add(CancellationMail.key, {
      order,
    })

    order.save()

    return res.status(204).send()
  }
}

export default new DeliveryProblemsController()
