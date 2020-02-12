import { Router } from 'express'
import jwt from 'jsonwebtoken'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()

routes.post('/login', SessionController.store)
routes.use(authMiddleware)

routes.get('/user', user.index)
routes.post('/user', user.store)

export default routes
