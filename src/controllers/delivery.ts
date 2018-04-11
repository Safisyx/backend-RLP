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
}
