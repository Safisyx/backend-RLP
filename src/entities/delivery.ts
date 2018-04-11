import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, OneToMany} from 'typeorm'
import {IsString, MinLength} from 'class-validator'
import {Order} from './order'

@Entity({name: 'deliveries'})
export class Delivery extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  deliveryType: string

  @IsString()
  @Column('text')
  condition: string

  @OneToMany(_ => Order, order => order.delivery)
  orders: Order[]
}
