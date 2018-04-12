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

  @Authorized()
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

  @Authorized()
  @Get('/orders')
  async getOrders(
    @CurrentUser() {id,role}
  ){
    if (role==='Internal') return await Order.find()
    return await Order.find({where:{userId:id}})
  }

  @Authorized()
  @Get('/orders/:id')
  async getOrder(
    @Param('id') id: number,
    @CurrentUser() currentUser
  ){
    if (currentUser.id!==id) throw new BadRequestError('You are not allowed to view that')
    const order = await Order.findOneById(id)
    if (!order) throw new NotFoundError('No such order')
    return order
  }
}
