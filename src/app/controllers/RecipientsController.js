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
        error: 'You must send address, address2, number, state, city, zipcode',
      })
    }

    const { name, address, address2, number, state, city, zipcode } = req.body

    try {
      const recipient_saved = await Recipient.create({
        name,
        address,
        address2,
        number,
        state,
        city,
        zipcode,
      })

      return res.status(200).json(recipient_saved)
    } catch (err) {
      return res.json(err)
    }
  }
}

export default new RecipientsController()
