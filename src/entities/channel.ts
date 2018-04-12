import { BaseEntity, PrimaryGeneratedColumn, OneToMany, Entity, OneToOne, ManyToMany, JoinTable} from 'typeorm'
import {Order} from './order'
import {Message} from './message'
import {User} from './user'

@Entity()
export class Channel extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => Order, order => order.channel)
  order: Order

  @OneToMany(_=> Message, messages=>messages.channel)
  messages: Message[]

  @ManyToMany(_=> User, user=> user.channels)
  @JoinTable({name:'channels_users'})
  users: User[]
}
