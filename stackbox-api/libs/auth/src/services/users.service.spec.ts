import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    service = unit;
    userRepository = unitRef.get(getRepositoryToken(UserEntity) as string);
    entityManager = unitRef.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(entityManager).toBeDefined();
  });

  it('should return entity and call save', async () => {
    const expected: UserEntity = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      auth0Id: 'test',
    };

    userRepository.findOneBy.mockResolvedValueOnce(null);
    userRepository.create.mockReturnValueOnce(expected);
    userRepository.save.mockResolvedValueOnce(expected);
    const result: UserEntity = await service.getOrCreateUserIfNotExists({
      auth0Id: expected.auth0Id,
    });

    expect(result).toEqual(expected);
    expect(userRepository.save).toHaveBeenCalledWith(expected);
  });

  it('should return entity', async () => {
    const expected: UserEntity = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      auth0Id: 'test',
    };

    userRepository.findOneBy.mockResolvedValueOnce(expected);
    const result: UserEntity = await service.getOrCreateUserIfNotExists({
      auth0Id: expected.auth0Id,
    });

    expect(result).toEqual(expected);
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
