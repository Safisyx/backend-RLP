import {JsonController, Param, Authorized, CurrentUser, NotFoundError, Get, Post,
   UploadedFile, BadRequestError} from 'routing-controllers'
import {Order} from '../entities/order'
import {Photo} from '../entities/photo'
import {User} from '../entities/user'
import {io} from '../index'
import {FILE_UPLOAD_OPTIONS} from '../fileUploadConfig'

const baseUrl = process.env.BASE_URL || 'http://localhost:4001'


@JsonController()
export default class PhotoController {

  @Authorized()
  @Post('/photos/order/:orderId')
  async addPhoto(
    @Param('orderId') orderId: number,
    @CurrentUser() {id,role},
    @UploadedFile('photo', {options: FILE_UPLOAD_OPTIONS}) file: any
  ){
    if (!file.path.match(/\.(jpg|jpeg|png|gif)$/)) throw new BadRequestError('Need an image')
    const order = await Order.findOneById(orderId)
    if (!order) throw new NotFoundError('No such order')

    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('User not found')
    if (role!=='Internal' && id!==user.id) throw new BadRequestError('Not allowed')

    await Photo.create({
      link: baseUrl + file.path.substring(6, file.path.length),
      order
    }).save()
    const updatedOrder = await Order.findOneById(orderId)
    const action = {
      type:'ADD_PHOTO',
      payload: updatedOrder
    }
    io.to('internalRoom').emit('action', action)
    io.to(`room${order.userId}`).emit('action', action)

    return action.payload

  }

  //JUST FOR TEST
  @Post('/photos')
  async add(
    @UploadedFile('photo', {options: FILE_UPLOAD_OPTIONS}) file: any
  ){
    if (!file.path.match(/\.(jpg|jpeg|png|gif)$/)) throw new BadRequestError('Need an image')
    return await Photo.create({
      link: baseUrl + file.path.substring(6, file.path.length)
    }).save()
  }

  @Authorized()
  @Get('/photos/order/:orderId')
  async getPhotos(
    @Param('orderId') orderId: number,
  ){
    const order = await Order.findOneById(orderId)
    if (!order) throw new NotFoundError('No such order')
    return await Photo.find({order})
  }
}
