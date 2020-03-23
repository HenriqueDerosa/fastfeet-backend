import cors from 'cors'
import multer from 'multer'
import multerConfig from './config/multer'
import { Router } from 'express'

import validateUser from './app/validators/user'
import validateSession from './app/validators/session'
import validateRecipients from './app/validators/recipients'
import validateDeliverymen from './app/validators/deliverymen'
import validateProblems from './app/validators/deliveryProblems'
import validateOrders from './app/validators/orders'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import RecipientsController from './app/controllers/RecipientsController'
import authMiddleware from './app/middlewares/auth'
import authAdminMiddleware from './app/middlewares/authAdmin'
import DeliverymenController from './app/controllers/DeliverymenController'
import FileController from './app/controllers/FileController'
import OrdersController from './app/controllers/OrdersController'
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController'

const routes = new Router()
const upload = multer(multerConfig)

routes.use(cors())

routes.post('/login', SessionController.store)
routes.post('/user', validateUser.store, user.store)

// Allows only authorized users
routes.use(authMiddleware)
routes.get('/user/:id', user.index)

routes.post('/files', upload.single('file'), FileController.store)

// Allows only admin users
routes.use(authAdminMiddleware)

// Recipients
routes.get('/recipients', RecipientsController.index)
routes.post('/recipients', validateRecipients.store, RecipientsController.store)
routes.put('/recipients', RecipientsController.update)
routes.delete('/recipients', RecipientsController.delete)

// Deliverymen
routes.get('/deliverymen', DeliverymenController.index)
routes.post(
  '/deliverymen',
  validateDeliverymen.store,
  DeliverymenController.store
)
routes.put('/deliverymen/:id', DeliverymenController.update)
routes.delete('/deliverymen/:id', DeliverymenController.delete)
routes.get('/deliverymen/:id/deliveries', DeliverymenController.orders)

// Orders / Deliveries
routes.get('/order', OrdersController.index)
routes.post('/order', validateOrders.store, OrdersController.store)
routes.put('/order/:id', OrdersController.update)
routes.put('/order/:id/pickup', validateOrders.pickup, OrdersController.pickup)
routes.put(
  '/order/:id/deliver',
  validateOrders.deliver,
  OrdersController.deliver
)
routes.delete('/order/:id', OrdersController.delete)

// Problems
routes.get(
  '/order/problems',
  validateProblems.index,
  DeliveryProblemsController.index
)
routes.get(
  '/order/:id/problems',
  validateProblems.show,
  DeliveryProblemsController.show
)
routes.post(
  '/order/:id/problems',
  validateProblems.store,
  DeliveryProblemsController.store
)
routes.delete('/problem/:id/cancel-order', DeliveryProblemsController.delete)

export default routes
