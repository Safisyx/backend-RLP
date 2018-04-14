import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, RelationId, ManyToOne} from 'typeorm'
import {IsString, MinLength, IsBoolean} from 'class-validator'
import { Exclude } from 'class-transformer';
import {User} from './user'
import {Order} from './order'

@Entity()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(1)
  @Column('text')
  content: string

  @IsBoolean()
  @Column('boolean', {default:false})
  read: boolean

  @Exclude()
  @ManyToOne(_ => User, user => user.messages)
  user: User

  @RelationId((message: Message)=> message.user)
  userId: number

  @ManyToOne(_ => Order, order => order.messages)
  @Exclude()
  order: Order

  @RelationId((message: Message)=> message.order)
  orderId: number

}
