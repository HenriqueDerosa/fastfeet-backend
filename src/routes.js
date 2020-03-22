import cors from 'cors'
import multer from 'multer'
import multerConfig from './config/multer'
import { Router } from 'express'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import RecipientsController from './app/controllers/RecipientsController'
import authMiddleware from './app/middlewares/auth'
import authAdminMiddleware from './app/middlewares/authAdmin'
import DeliverymenController from './app/controllers/DeliverymenController'
import FileController from './app/controllers/FileController'
import OrdersController from './app/controllers/OrdersController'

const routes = new Router()
const upload = multer(multerConfig)

routes.use(cors())

routes.post('/login', SessionController.store)
routes.post('/user', user.store)

// Allows only authorized users
routes.use(authMiddleware)
routes.get('/user/:id', user.index)

routes.post('/files', upload.single('file'), FileController.store)

// Allows only admin users
routes.use(authAdminMiddleware)
routes.post('/recipients', RecipientsController.store)

routes.get('/deliverymen', DeliverymenController.index)
routes.post('/deliverymen', DeliverymenController.store)
routes.put('/deliverymen/:id', DeliverymenController.update)
routes.delete('/deliverymen/:id', DeliverymenController.delete)
routes.get('/deliverymen/:id/deliveries', DeliverymenController.orders)
routes.put('/deliverymen/:id/update-order', DeliverymenController.updateOrder)

routes.get('/order', OrdersController.index)
routes.post('/order', OrdersController.store)
routes.put('/order/:id', OrdersController.update)
routes.delete('/order/:id', OrdersController.delete)

export default routes
