import * as yup from 'yup'
import { validationError } from '../utils/constants'

const index = async (req, res, next) => {
  const schema = yup.object().shape({
    id: yup.number(),
  })

  try {
    await schema.validate(req.params, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

const show = async (req, res, next) => {
  const schema = yup.object().shape({
    id: yup.number(),
  })

  try {
    await schema.validate(req.params, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

const store = async (req, res, next) => {
  const schema = yup.object().shape({
    description: yup.string().required(),
  })

  try {
    await schema.validate(req.body, { abortEarly: false })
    next()
  } catch (err) {
    return res.status(400).json(validationError(err))
  }
}

export default {
  index,
  show,
  store,
}
