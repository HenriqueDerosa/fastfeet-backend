import * as yup from 'yup'
import Deliverymen from '../models/Deliverymen'

class DeliverymenController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You must send name, email',
      })
    }

    const { email } = req.body

    const existentCourier = await Deliverymen.findOne({ where: { email } })

    if (existentCourier) {
      return res.status(400).json({
        error: 'There is already a courier with the email provided',
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
    const couriers = await Deliverymen.findAll()

    return res.status(200).json(couriers)
  }

  async update(req, res) {
    const { id } = req.params

    const courier = await Deliverymen.findByPk(id)

    if (!courier) {
      return res.status(404).json({ error: 'Courier does not exists.' })
    }

    const { name, email } = await Deliverymen.update(req.body)

    return res.json({ id, name, email })
  }

  async delete(req, res) {
    const { id } = req.params

    const courier = await Deliverymen.findByPk(id)

    if (!courier) {
      return res.status(404).json({ error: 'Courier does not exists' })
    }

    try {
      await Deliverymen.destroy({ where: { id } })
      return res.status(200).json({
        status: `courier '${courier.name}' has been sucessfuly removed`,
      })
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new DeliverymenController()
