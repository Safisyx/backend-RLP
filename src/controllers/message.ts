import { JsonController, Post, Body, BadRequestError, Authorized, CurrentUser, Param, NotFoundError } from 'routing-controllers'
import {User} from '../entities/user'
import {Order} from '../entities/order'
import {Message} from '../entities/message'
import {io} from '../index'

@JsonController()
export default class MessageController {

  @Authorized()
  @Post('/messages/:orderId')
  async sendMessage(
    @Param('orderId') orderId: number,
    @Body() {message},
    @CurrentUser() {id, role}
  ){
    const order = await Order.findOneById(orderId)
    if (!order) throw new NotFoundError('Order not found')

    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('User not found')
    if (role!=='Internal' && id!==user.id) throw new BadRequestError('Not allowed')

    await Message.create({content:message, order, user}).save()
    const updatedOrder = await Order.findOneById(orderId)

    const action = {
      type:'ADD_MESSAGE',
      payload: updatedOrder
    }
    io.to('internalRoom').emit('action', action)
    io.to(`room${user.id}`).emit('action', action)

    return action.payload
  }
}
