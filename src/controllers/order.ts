import {
  JsonController, Authorized, CurrentUser, Post, Param, HttpCode, NotFoundError, BadRequestError, Get,
  Body, Patch, Delete
} from 'routing-controllers'
import {Order} from '../entities/order'
import {Address} from '../entities/address'
import {User} from '../entities/user'
import {Delivery} from '../entities/delivery'

@JsonController()
export default class OrderController {

  @Post('/orders')
  @HttpCode(201)
  async createOrders(
    @Body() {order, addresses},
  ) {

    const date = order.orderDate || new Date()

    const delivery = await Delivery.findOneById(order.deliveryId)
    const entity =  await Order.create({...order, orderDate:date, delivery}).save()


    for(let i=0;i<addresses.length;i++){
       await Address.create({...addresses[i],order:entity}).save()
    }

    const orderToSend = await Order.findOneById(entity.id)
    if (!orderToSend) throw new NotFoundError('An error occured')
    return orderToSend
  }

  @Get('/orders')
  async getOrders(
  ){
    return await Order.find()
  }

  @Get('/orders/:id')
  async getOrder(
    @Param('id') id: number
  ){
    const order = await Order.findOneById(id)
    if (!order) throw new NotFoundError('No such order')
    return order
  }
}
