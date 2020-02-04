import { Router } from 'express'

import user from './app/controllers/UserController'

const routes = new Router()

routes.get('/user', user.index)
routes.post('/user', user.store)

export default routes
