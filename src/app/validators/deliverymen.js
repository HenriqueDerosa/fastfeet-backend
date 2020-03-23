import * as yup from 'yup'
import { validationError } from '../utils/constants'

const store = async (req, res, next) => {
  const schema = yup.object().shape({
    name: yup.string(),
    email: yup.string(),
  })

  try {
    await schema.validate(req.body, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

export default {
  store,
}
