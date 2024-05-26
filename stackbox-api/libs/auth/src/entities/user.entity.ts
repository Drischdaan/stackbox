import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { ApiSchema } from '../../../common/src';
import { EntityBase } from '../../../database/src';
import { IUserEntity } from '../models/user.models';

@Entity('users')
@ApiSchema({ name: 'User' })
export class UserEntity extends EntityBase implements IUserEntity {
  @Column({ unique: true })
  @ApiProperty()
  auth0Id: string;
}
