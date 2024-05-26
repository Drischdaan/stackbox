import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  CrudService,
  RelationsMapping,
} from '../../../common/src/services/crud.service';
import { UserEntity } from '../entities/user.entity';
import { UserCreateDto } from '../models/user.models';

@Injectable()
export class UsersService extends CrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    protected readonly entityManager: EntityManager,
  ) {
    super(userRepository, entityManager);
  }

  getUniqueConstraints(): (keyof UserEntity)[] {
    return ['auth0Id'];
  }

  getRelationFields(): RelationsMapping<UserEntity> {
    return {};
  }

  async getOrCreateUserIfNotExists(
    createDto: UserCreateDto,
  ): Promise<UserEntity> {
    const entity: UserEntity | null = await this.userRepository.findOneBy({
      auth0Id: createDto.auth0Id,
    });
    if (entity !== null) return entity;
    return await this.userRepository.save(
      this.userRepository.create(createDto),
    );
  }
}
