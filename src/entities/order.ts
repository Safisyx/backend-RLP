import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, RelationId, OneToMany} from 'typeorm'
import {IsInt, IsString, Min, MinLength, IsDate, IsBoolean} from 'class-validator'
import {Delivery} from './delivery'
import {User} from './user'
import {Address} from './address'
import {Message} from './message'
import {Photo} from './photo'

@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  shortDescription: string

  @IsString()
  @Column('text', {nullable: true})
  description: string

  @IsInt()
  @Min(1)
  @Column('integer', {default:1})
  amount: number

  @IsDate()
  @Column('date')
  orderDate: Date

  @IsDate()
  @Column('date', {nullable:true})
  deliveryDate: Date

  @IsInt()
  @Column('integer', {nullable:false})
  orderNumber: number

  @IsString()
  @MinLength(1)
  @Column('text', {nullable:true})
  paymentType: string

  @IsBoolean()
  @Column('boolean', {default: false})
  archived: boolean

  @IsBoolean()
  @Column('boolean', {default: false})
  locked: boolean

  @ManyToOne(_ => Delivery, delivery => delivery.orders)
  delivery: Delivery

  @RelationId((order: Order)=> order.delivery)
  deliveryId: number

  @ManyToOne(_ => User, user => user.orders)
  user: User

  @RelationId((order: Order)=> order.user)
  userId: number

  @OneToMany(_ => Address, addresses => addresses.order, {eager: true})
  addresses: Address[]

  @OneToMany(_=> Message, message => message.order, {eager: true})
  messages: Message[]

  @OneToMany(_=> Photo, photos => photos.order, {eager: true})
  photos: Photo[]

}
