import 'reflect-metadata'
import { Action, BadRequestError, useKoaServer } from 'routing-controllers'
import setupDb from './db'

import { verify } from './jwt'

import * as Koa from 'koa'
import {Server} from 'http'
import * as IO from 'socket.io'
import * as socketIoJwtAuth from 'socketio-jwt-auth'
import {secret} from './jwt'

import OrderController from './controllers/order'
import DeliveryController from './controllers/delivery'
import LoginController from './controllers/login'
import UserController from './controllers/users'
import MessageController from './controllers/message'
import PhotoController from './controllers/photo'
import {User} from './entities/user'
import CompanyController from './controllers/company'

import * as serve from 'koa-static'

const app = new Koa()
const server = new Server(app.callback())
export const io = IO(server)
const port = process.env.PORT || 4001

useKoaServer(app, {
  cors: true,
  controllers: [
    OrderController,
    DeliveryController,
    LoginController,
    UserController,
    MessageController,
    CompanyController,
    PhotoController,
  ],
  authorizationChecker: (action: Action) => {
  const header: string = action.request.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const [, token] = header.split(' ');

    try {
      return !!(token && verify(token));
    } catch (e) {
        throw new BadRequestError(e);
      }
    }
  return false;
  },

  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ');

      if (token) {
        const { id, role } = verify(token);
        return { id, role }
      }
    }
    return {};
  }
  })

io.use(socketIoJwtAuth.authenticate({ secret }, async (payload, done) => {
  const user = await User.findOneById(payload.id)
  if (user) done(null, user)
  else done(null, false, `Invalid JWT user ID`)
}))

io.on('connect', socket => {
  const user = socket.request.user
  console.log(`User ${user.firstName} just connected`)

  let room
  if (user.role==='Internal') room = 'internalRoom'
  else room = `room${user.id}`
  socket.join(room)
  console.log(`User ${user.firstName} joins room`, room)

  socket.on('room', room => {  //Not needed for now but maybe later
   socket.join(room)
  })

  socket.on('leave', room => { //Not needed for now but maybe later
    socket.leave(room)
  })

  socket.on('disconnect', () => {
    socket.leave(room)
    console.log(`User ${user.firstName} just disconnected`)
  })
})

app.use(serve('./public'))

setupDb()
  .then(_ => {
    server.listen(port)
    console.log(`Listening on port ${port}`)
  })
  .catch(err => console.error(err))
