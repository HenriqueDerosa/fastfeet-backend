import * as yup from 'yup'
import Recipient from '../models/Recipient'
import User from '../models/User'

class RecipientsController {
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
}

export default new RecipientsController()
