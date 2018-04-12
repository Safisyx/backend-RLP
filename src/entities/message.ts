import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {IsString, MinLength} from 'class-validator'
import {User} from './user'
import {Channel} from './channel'

@Entity()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(1)
  @Column('text')
  content: string

  @IsString()
  @Column('text')
  condition: string

  @OneToOne(_ => User, user => user.message)
  @JoinColumn()
  user: User

  @ManyToOne(_=>Channel, channel=>channel.messages)
  channel: Channel
}
