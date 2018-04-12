import { JsonController, Post, Param, Get, Put, Patch, NotFoundError, Body, Delete, Authorized } from 'routing-controllers'
import {User} from '../entities/user';

@JsonController()
export default class UserController {
//not going to post the password but patch
  @Post('/users')
  async signup(
    @Body() user: User
  ) {
    const {password, ...rest} = user //need to come out...
    const entity = User.create(rest)
    await entity.setPassword(password) /// going to be at patch
    return entity.save()
  }
}
