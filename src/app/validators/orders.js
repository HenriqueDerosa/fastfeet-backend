import * as yup from 'yup'
import { validationError } from '../utils/constants'

const store = async (req, res, next) => {
  const schema = yup.object().shape({
    recipient_id: yup.number(),
    deliveryman_id: yup.number(),
    product: yup.string(),
  })

  try {
    await schema.validate(req.body, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

const pickup = async (req, res, next) => {
  const schema = yup.object().shape({
    start_date: yup.date(),
  })

  try {
    await schema.validate(req.body, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

const deliver = async (req, res, next) => {
  const schema = yup.object().shape({
    end_date: yup.date().required(),
    signature_id: yup.number().required(),
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
  pickup,
  deliver,
}
