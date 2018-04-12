import { JsonController, Post, Param, Get, Patch, NotFoundError, Body, Delete, Authorized, CurrentUser, BadRequestError } from 'routing-controllers'
import {User} from '../entities/user';
import { sign } from '../jwt'

@JsonController()
export default class UserController {
//for authorization at this point there is a lack in security (authentication)... users can access by changing other user's password easier.
// We need to fix that 
  @Patch('/signup/:id([0-9]+)')
  async signupUser(
    @Param('id') id: number,
    @Body() {password}
  ) {
    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('Cannot find user')
    console.log(password)
    await user.setPassword(password)
    await user.save()
    if (!await user.checkPassword(password)) throw new BadRequestError('The password is not correct')
    const jwt = sign({ id: user.id!, role: user.role! })
    return { jwt }
  }

  @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Authorized()
  @Patch('/users/:id')
  async patchUser(
    @Param('id') userId: number,
    @CurrentUser() currentUser,
    @Body() update
  ){
    if (currentUser.role !== 'Internal') throw new BadRequestError('Unauthorized to edit user')
    //console.log(role)
    const user = await User.findOneById(userId)
    if (!user) throw new NotFoundError('User not found')
    const {password, ...rest}=update
    await User.merge(user, rest).save()
    return user
  }

  @Authorized()
  @Get('/users')
  async allUsers(
    @CurrentUser() { role},
  ) {
    if (role !== 'Internal') throw new BadRequestError('Cannot see other users info')
    return User.find()
  }

  @Authorized()
  @Post('/users')
    async createUser(
      @CurrentUser() { role },
      @Body() user
    ) {

      if (role !== 'Internal') throw new BadRequestError('Cannot create user')
      const {password, ...rest} = user
      await User.create(rest).save()
      return user
    }

    @Authorized()
    @Delete('/users/:id([0-9]+)')
    async removeUser(
    @Param('id') id: number,
    @CurrentUser() currentUser,
    )  {
      if (currentUser.role !=='Internal') throw new BadRequestError('Cannot delete other users')
      const user = await User.findOneById(id)
      if (!user) throw new NotFoundError('Cannot find user')
      user.remove()
      return "user succesfully deleted"
    }
  }
