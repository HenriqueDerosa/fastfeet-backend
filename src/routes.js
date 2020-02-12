import { Router } from 'express'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import RecipientsController from './app/controllers/RecipientsController'
import authMiddleware from './app/middlewares/auth'
import authAdminMiddleware from './app/middlewares/authAdmin'

const routes = new Router()

routes.post('/login', SessionController.store)
routes.post('/user', user.store)

// Allows only
routes.use(authMiddleware)
routes.get('/user', user.index)

// Allows only admin user access
routes.use(authAdminMiddleware)
routes.post('/recipients', RecipientsController.store)

export default routes
