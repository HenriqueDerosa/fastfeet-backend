import * as yup from 'yup'
import Recipient from '../models/Recipient'
import User from '../models/User'

class RecipientsController {
  async store(req, res) {
    const schema = yup.object().shape({
      address: yup.string(),
      address2: yup.string(),
      number: yup.number(),
      state: yup.string(),
      city: yup.string(),
      zipcode: yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'You must send address, address2, number, state, city, zipcode',
      })
    }

    const { address, address2, number, state, city, zipcode } = req.body

    return res.status(200).json({
      status: 'success',
      address,
      address2,
      number,
      state,
      city,
      zipcode,
    })
  }
}

export default new RecipientsController()
