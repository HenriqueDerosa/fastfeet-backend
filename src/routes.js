import { Router } from 'express'
import jwt from 'jsonwebtoken'

import user from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = new Router()

routes.post('/login', SessionController.store)
routes.get('/user', user.index)
routes.post('/user', user.store)

export default routes
