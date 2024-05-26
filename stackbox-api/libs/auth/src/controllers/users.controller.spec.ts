import { TestBed } from '@automock/jest';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  DeleteResponse,
  PaginationDto,
} from '../../../common/src/models/common.models';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    controller = unit;
    usersService = unitRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should return all users', async () => {
    const expected: PaginationDto<UserEntity> = {
      items: [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          auth0Id: 'testId',
        },
      ],
      limit: DEFAULT_PAGINATION_LIMIT,
      page: DEFAULT_PAGINATION_PAGE,
      total: 1,
    };
    usersService.getPaginatedList.mockResolvedValueOnce(expected);

    const result = await controller.getUsersPaginated();
    expect(result).toEqual(expected);
  });

  it('should return user by id', async () => {
    const expected: UserEntity = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      auth0Id: 'testId',
    };
    usersService.getById.mockResolvedValueOnce(expected);

    const result = await controller.getUserById(expected.id);
    expect(result).toEqual(expected);
  });

  it('should delete user by id', async () => {
    const expected: DeleteResponse = {
      id: '1',
    };
    usersService.delete.mockResolvedValueOnce(true);

    const result = await controller.deleteUser(expected.id);
    expect(result).toEqual(expected);
  });
});
