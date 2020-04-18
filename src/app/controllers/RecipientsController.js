import { Op } from 'sequelize'
import Recipient from '../models/Recipient'

class RecipientsController {
  async index(req, res) {
    const { q } = req.query

    const filter = {
      where: q && {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      },
    }

    const recipient = await Recipient.findAll(filter)
    return res.status(200).json(recipient)
  }

  async store(req, res) {
    try {
      const {
        name,
        address,
        address2,
        number,
        state,
        city,
        zipcode,
      } = await Recipient.create(req.body)

      return res
        .status(200)
        .json({ name, address, address2, number, state, city, zipcode })
    } catch (err) {
      return res.json(err)
    }
  }

  // updates values of specified recipient
  async update(req, res) {
    const { id } = req.params

    const recipient = await Recipient.findByPk(id)

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient does not exists.' })
    }

    const {
      name,
      address,
      address2,
      number,
      state,
      city,
      zipcode,
    } = await Recipient.update(req.body)

    return res.status(200).json({
      id,
      name,
      address,
      address2,
      number,
      state,
      city,
      zipcode,
    })
  }

  async delete(req, res) {
    const { id } = req.params

    const recipient = await Recipient.findByPk(id)

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient does not exists' })
    }

    try {
      await Recipient.destroy({ where: { id } })
      return res.status(204).send()
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new RecipientsController()
