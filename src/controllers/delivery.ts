import {
  JsonController, Authorized, CurrentUser, Post, Param, HttpCode, NotFoundError, BadRequestError, Get,
  Body, Patch, Delete
} from 'routing-controllers'
import {Delivery} from '../entities/delivery'

@JsonController()
export default class DeliveryController {

  @Authorized()
  @Post('/deliveries')
  @HttpCode(201)
  async createDelivery(
    @Body() {deliveryType, condition},
    @CurrentUser() {role}
  ) {
    if (role!=='Internal') throw new BadRequestError('You are not allowed to do that')
    const delivery = await Delivery.create({deliveryType, condition}).save()

    const entity= await Delivery.findOneById(delivery.id)
    if (!entity) throw new NotFoundError('An error occured')
    return entity
  }

  @Authorized()
  @Get('/deliveries')
  async getDeliveries(
  ){
    const notSorted = await Delivery.find()
    return notSorted.sort((a,b)=>{
      if(!b.id || !a.id) return -1
      return a.id-b.id
    })
  }

  @Authorized()
  @Get('/deliveries/:id')
  async getDelivery(
    @Param('id') id: number
  ){
    const delivery = await Delivery.findOneById(id)
    if (!delivery) throw new NotFoundError('No such delivery')
    return delivery
  }

  @Authorized()
  @Delete('/deliveries/:id')
  async deleteDelivery(
    @Param('id') id: number,
    @CurrentUser() {role}
  ){
    if (role!=='Internal') throw new BadRequestError('You are not allowed to do that')
    const delivery = await Delivery.findOneById(id)
    if (!delivery) throw new NotFoundError('No such delivery')
    delivery.remove()
    return {
      message: 'Successfully removed'
    }
  }

  @Authorized()
  @Patch('/deliveries/:id')
  async patchDelivery(
    @Param('id') id: number,
    @Body() {deliveryType, condition},
    @CurrentUser() {role}
  ){
    if (role!=='Internal') throw new BadRequestError('You are not allowed to do that')
    const delivery = await Delivery.findOneById(id)
    if (!delivery) throw new NotFoundError('No such delivery')
    if (deliveryType) delivery.deliveryType=deliveryType
    if (condition) delivery.condition=condition
    await delivery.save()
    return delivery
  }
}
