import {
  JsonController, Authorized, CurrentUser, Post, Param, HttpCode, NotFoundError, BadRequestError, Get,
  Body, UploadedFile
} from 'routing-controllers'
import {Order} from '../entities/order'
import {Address} from '../entities/address'
import {Delivery} from '../entities/delivery'
import {User} from '../entities/user'
import {Photo} from '../entities/photo'
import {Company} from '../entities/company'
import {FILE_UPLOAD_OPTIONS} from '../fileUploadConfig'
const baseUrl = process.env.SERVER_URL || 'http://localhost:4001'

@JsonController()
export default class OrderController {

  @Authorized()
  @Post('/orders')
  @HttpCode(201)
  async createOrders(
    @Body() body,
    @CurrentUser() {id,role},
    @UploadedFile('photo', {options: FILE_UPLOAD_OPTIONS}) file: any
    ) {
    const order = JSON.parse(body.order)
    const addresses = JSON.parse(body.addresses)
    if (role!=='External') throw new BadRequestError('Only client can create order')

    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('User not found')

    const company = await Company.findOneById(user.companyId)
    if (!company) throw new NotFoundError('Company not found')

    const userEmail = user.email
    const date = order.orderDate || new Date()

    const delivery = await Delivery.findOneById(order.deliveryId)

    const entity =  await Order.create({...order, orderDate:date, delivery, user, company, userEmail}).save()


    for(let i=0;i<addresses.length;i++){
       await Address.create({...addresses[i],order:entity}).save()
    }
    console.log(file?true:false)
    if (file){
      await Photo.create({
        link: baseUrl + file.path.substring(6, file.path.length),
        order:entity
      }).save()
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
    const user =await User.findOneById(id)
    if(!user) throw new NotFoundError('User not found')
    const company = await Company.findOneById(user.companyId)
    return await Order.find({where:{company:company}})
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


  @Authorized()
  @Get('/orders/orderNumber/newNumber')
  async getNewNumber(
  ){
    const orders = await Order.find()
    if (orders.length===0) return {
      orderNumber: 10001
    }
    const sorted = orders.sort((a,b)=>{
      console.log(typeof(a.orderNumber))
      if (a.orderNumber>b.orderNumber)
        return 1
      return -1
    })
    return {
      orderNumber: sorted[sorted.length-1].orderNumber+1
    }
  }

  @Authorized()
  async editOrder(
    @Param('id') id: number,
    @CurrentUser() currentUser,
    @Body() body
  ){
    if (currentUser.role!=='Internal') throw new BadRequestError('You are not allowed to do that')
    const order = await Order.findOneById(id)
    if (!order) throw new NotFoundError('No such order')
    await Order.merge(order, body).save()
    return order
  }
}
