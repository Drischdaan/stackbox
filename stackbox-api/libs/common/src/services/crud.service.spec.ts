import { TestBed } from '@automock/jest';
import { Injectable } from '@nestjs/common';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Column, EntityManager, OneToOne, Repository } from 'typeorm';
import { EntityBase } from '../../../database/src';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  PaginationDto,
} from '../models/common.models';
import { CrudService, RelationsMapping } from './crud.service';

class TestEntity2 extends EntityBase {
  @Column()
  name: string;

  @Column()
  description: string;
}

class TestEntity extends EntityBase {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToOne(() => TestEntity2, { nullable: true })
  test2?: TestEntity2;
}

@Injectable()
class TestCrudService extends CrudService<TestEntity> {
  constructor(
    @InjectRepository(TestEntity)
    repository: Repository<TestEntity>,
    entityManager: EntityManager,
    @InjectRepository(TestEntity2)
    repository2: Repository<TestEntity2>,
  ) {
    super(repository, entityManager);
    repository2;
  }

  getUniqueConstraints(): Array<keyof TestEntity> {
    return ['name'];
  }

  getRelationFields(): RelationsMapping<TestEntity> {
    return { test2: TestEntity2 };
  }
}

describe('CrudService', () => {
  let service: TestCrudService;
  let repository: jest.Mocked<Repository<TestEntity>>;
  let entityManager: jest.Mocked<EntityManager>;
  let repository2: jest.Mocked<Repository<TestEntity2>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TestCrudService).compile();

    service = unit;
    repository = unitRef.get(getRepositoryToken(TestEntity) as string);
    entityManager = unitRef.get(EntityManager);
    repository2 = unitRef.get(getRepositoryToken(TestEntity2) as string);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return unique constraints', () => {
    expect(service.getUniqueConstraints()).toEqual(['name']);
  });

  it('should return relation fields', () => {
    expect(service.getRelationFields()).toEqual({ test2: TestEntity2 });
  });

  it('should return list', async () => {
    const expected: TestEntity[] = [
      {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test',
        description: 'test',
      },
    ];
    repository.find.mockResolvedValueOnce(expected);
    const result = await service.getList();

    expect(result).toEqual(expected);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return paginated list', async () => {
    const expected: PaginationDto<TestEntity> = {
      items: [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'test',
          description: 'test',
        },
      ],
      total: 1,
      limit: DEFAULT_PAGINATION_LIMIT,
      page: DEFAULT_PAGINATION_PAGE,
    };
    repository.findAndCount.mockResolvedValueOnce([
      expected.items,
      expected.total,
    ]);
    const result = await service.getPaginatedList();

    expect(result).toEqual(expected);
    expect(repository.findAndCount).toHaveBeenCalled();
  });

  it('should return by id', async () => {
    const expected: TestEntity = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'test',
      description: 'test',
    };
    repository.findOne.mockResolvedValueOnce(expected);
    const result = await service.getById(expected.id);

    expect(result).toEqual(expected);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: expected.id },
      relations: undefined,
    });
  });

  describe('create', () => {
    it('should create', async () => {
      const expected: TestEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test',
        description: 'test',
        test2: {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'test2',
          description: 'test2',
        },
      };
      repository2.findOne.mockResolvedValueOnce(expected.test2);
      entityManager.getRepository.mockReturnValueOnce(repository2);
      repository.findOneBy.mockResolvedValueOnce(null);
      repository.save.mockResolvedValueOnce(expected);
      const result = await service.create(expected);

      expect(result).toEqual(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });

    it('should not create if entity exists', async () => {
      const expected: TestEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test',
        description: 'test',
      };
      repository.findOneBy.mockResolvedValueOnce(expected);
      const result = await service.create(expected);

      expect(result).toBeNull();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should not create if relation does not exist', async () => {
      const expected: TestEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test',
        description: 'test',
        test2: {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'test2',
          description: 'test2',
        },
      };
      repository2.findOne.mockResolvedValueOnce(null);
      entityManager.getRepository.mockReturnValueOnce(repository2);
      repository.findOneBy.mockResolvedValueOnce(null);
      const result = service.create(expected);

      await expect(result).rejects.toThrow();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  it('should update', async () => {
    const expected: TestEntity = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'test',
      description: 'test',
    };
    repository.findOne.mockResolvedValueOnce(expected);
    repository.save.mockResolvedValueOnce(expected);
    const result = await service.update(expected.id, expected);

    expect(result).toEqual(expected);
    expect(repository.save).toHaveBeenCalledWith(expected);
  });

  it('should delete', async () => {
    repository.delete.mockResolvedValueOnce({ affected: 1, raw: {} });
    const result = await service.delete('1');

    expect(result).toBeTruthy();
    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
