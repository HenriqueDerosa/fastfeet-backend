import { Op } from 'sequelize'
import * as yup from 'yup'
import Recipient from '../models/Recipient'

import { PER_PAGE } from '../utils/constants'

class RecipientsController {
  async index(req, res) {
    const { page = 1, q } = req.query

    const filter = {
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
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
    const schema = yup.object().shape({
      name: yup.string(),
      address: yup.string(),
      address2: yup.string(),
      number: yup.string(),
      state: yup.string(),
      city: yup.string(),
      zipcode: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You sent wrong data',
      })
    }

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
      return res.status(200).json({
        status: `recipient '${recipient.name}' has been sucessfuly removed`,
      })
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new RecipientsController()
