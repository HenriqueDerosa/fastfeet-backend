import { Router } from 'express'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import RecipientsController from './app/controllers/RecipientsController'
import authMiddleware from './app/middlewares/auth'
import authAdminMiddleware from './app/middlewares/authAdmin'
import DeliverymenController from './app/controllers/DeliverymenController'

const routes = new Router()

routes.post('/login', SessionController.store)
routes.post('/user', user.store)

// Allows only authorized users
routes.use(authMiddleware)
routes.get('/user', user.index)

// Allows only admin users
routes.use(authAdminMiddleware)
routes.post('/recipients', RecipientsController.store)

routes.post('/delieverymen', DeliverymenController.store)
routes.put('/delieverymen/:id', DeliverymenController.update)
routes.delete('/delieverymen/:id', DeliverymenController.delete)

export default routes
