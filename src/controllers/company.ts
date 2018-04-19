import {
  JsonController, Authorized, CurrentUser, Post, Param, HttpCode, NotFoundError, BadRequestError, Get,
  Body, UploadedFile
} from 'routing-controllers'
import {Order} from '../entities/order'
import {User} from '../entities/user'
import {Company} from '../entities/company'

@JsonController()
export default class CompanyController {

  @Get("/companies")
  allCompanies() {
    return Company.find();
  }
  // @Authorized()
  // @Get('/companies')
  // async getCompanies(
  //   @CurrentUser() {id,role}
  // ){
  // //  if (role==='Internal') return await Order.find()
  //   return await Company.find()
  // }

  @Authorized()
  @Get('/companies/:id')
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
  @Post('/companies')
  async addCompany(
    @Body() company,
    @CurrentUser() {role}
  ){
    if (role!=='Internal') throw new BadRequestError('Not allowed to create a company')
    const ncompany = await Company.create(company).save()
    return await Company.findOneById(ncompany.id)
  }
}
