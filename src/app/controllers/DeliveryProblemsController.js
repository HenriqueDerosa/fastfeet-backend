import * as yup from 'yup'
import DeliveryProblem from '../models/DeliveryProblem'
import Order from '../models/Order'

class DeliveryProblemsController {
  // list all orders with problems
  async index(req, res) {
    const schema = yup.object().shape({
      id: yup.number(),
    })

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    const { id: delivery_id } = req.params

    const problems = await Order.findAll({
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
    const schema = yup.object().shape({
      id: yup.number(),
    })

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    const { id: delivery_id } = req.params

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id,
      },
      attributes: ['id', 'description'],
    })
    if (!problems) {
      return res.status(404).json({ error: 'not found' })
    }
    return res.json(problems)
  }

  async store(req, res) {
    const schema = yup.object().shape({
      description: yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    const { id: delivery_id } = req.params
    const { description } = req.body

    console.log(description)

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

  // cancel order based on problem's id
  async delete(req, res) {
    const schema = yup.object().shape({
      id: yup.string().required(),
    })

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

    const { id } = req.params

    const problem = await DeliveryProblem.findByPk(id)
    console.log(problem)
    const order = await Order.destroy({
      where: {
        id: problem.delivery_id,
      },
    })

    return res.status(200).json({
      status: `removed order ${problem.delivery_id} of problem ${id}`,
      order,
    })
  }
}

export default new DeliveryProblemsController()