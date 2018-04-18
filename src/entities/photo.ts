import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, RelationId} from 'typeorm'
import {IsString, MinLength} from 'class-validator'
import {Order} from './order'

@Entity()
export class Photo extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  link: string

  @ManyToOne(_ => Order, order => order.photos)
  order: Order

  @RelationId((photo: Photo)=> photo.order)
  orderId: number
}
