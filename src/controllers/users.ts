import { JsonController, Post, Param, Get, Patch, NotFoundError, Body, Delete, Authorized, CurrentUser, BadRequestError } from 'routing-controllers'
import {User} from '../entities/user';
import { sign, signup, verifySignup } from '../jwt'

@JsonController()
export default class UserController {
//for authorization at this point there is a lack in security (authentication)... users can access by changing other user's password easier.
// We need to fix that
  @Patch('/signup/:jwtSignup')
  async signupUser(
    @Param('jwtSignup') jwtSignup: string,
    @Body() {password}
  ) {
    const {id,role,email}=verifySignup(jwtSignup)
    console.log(id,role,email)
    if (!id || !role || !email) throw new BadRequestError('ERROR ERROR ERROR')
    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('Cannot find user')
    console.log(password)
    await user.setPassword(password)
    await user.save()
    if (!await user.checkPassword(password)) throw new BadRequestError('The password is not correct')
    const jwt = sign({ id: user.id!, role: user.role! })
    return { jwt, id: user.id}
  }

  @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number,
    @CurrentUser() {role}
  ) {
    if (role!=='Internal') throw new BadRequestError('You are not allowed to get this info')
    return User.findOneById(id)
  }

  @Authorized()
  @Get('/users/currentUser')
  async getCurrentUser(
    @CurrentUser() currentUser
  ){
    const user = await User.findOneById(currentUser.id)
    if (!user) throw new NotFoundError('User not found')
    return user
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
    const userToSend = await User.create(rest).save()
    const userRole=(!userToSend.role)? 'External': userToSend.role
    return {
      jwt:signup({ id: userToSend.id!, role: userRole, email: userToSend.email! })
    }
  }

  @Authorized()
  @Get('/jwt/:email')
  async getJwt(
    @Param('email') email: string,
    @CurrentUser() {role}
  ){
    if (role !== 'Internal') throw new BadRequestError('You cannot do that')
    const user = await User.findOne({where:{email}})
    if (!user) throw new NotFoundError('User not found')
    return {
      jwt:signup({ id: user.id!, role: user.role!, email: user.email! })
    }
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
