import { IEntityBase } from '../../../database/src';

export interface IUser {
  auth0Id: string;
}

export interface IUserEntity extends IEntityBase, IUser {}

export class UserCreateDto {
  auth0Id: string;
}
