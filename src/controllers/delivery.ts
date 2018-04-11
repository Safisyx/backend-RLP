import {
  JsonController, Authorized, CurrentUser, Post, Param, HttpCode, NotFoundError, BadRequestError, Get,
  Body, Patch, Delete
} from 'routing-controllers'
import {Order} from '../entities/order'
import {Delivery} from '../entities/delivery'

@JsonController()
export default class DeliveryController {

  @Post('/deliveries')
  @HttpCode(201)
  async createDelivery(
    @Body() {deliveryType, condition},
  ) {

    const delivery = await Delivery.create({deliveryType, condition}).save()

    const entity= await Delivery.findOneById(delivery.id)
    if (!entity) throw new NotFoundError('An error occured')
    return entity
  }

  @Get('/deliveries')
  async getDeliveries(
  ){
    const notSorted = await Delivery.find()
    return notSorted.sort((a,b)=>{
      if(!b.id || !a.id) return -1
      return a.id-b.id
    })
  }

  @Get('/deliveries/:id')
  async getDelivery(
    @Param('id') id: number
  ){
    const delivery = await Delivery.findOneById(id)
    if (!delivery) throw new NotFoundError('No such delivery')
    return delivery
  }

  @Delete('/deliveries/:id')
  async deleteDelivery(
    @Param('id') id: number
  ){
    const delivery = await Delivery.findOneById(id)
    if (!delivery) throw new NotFoundError('No such delivery')
    delivery.remove()
    return {
      message: 'Successfully removed'
    }
  }
}
