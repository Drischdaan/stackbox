import { HttpException, HttpStatus, Type } from '@nestjs/common';
import { EntityBase } from '@stackbox/database';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import {
  DEFAULT_PAGINATION_OPTIONS,
  PaginationDto,
  PaginationOptions,
} from '../models/common.models';

export type RelationsMapping<TEntity> = {
  [key in keyof TEntity]?: Type<EntityBase>;
};

export class CrudCreateOptions {
  checkRelations?: boolean = true;
}

export interface ICrudService<TEntity extends EntityBase> {
  getUniqueConstraints(): Array<keyof TEntity>;
  getRelationFields(): RelationsMapping<TEntity>;
  getList(
    options?: PaginationOptions,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TEntity[]>;
  getPaginatedList(
    options?: PaginationOptions,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<PaginationDto<TEntity>>;
  getById(
    id: string,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TEntity>;
  create<TCreateDto extends DeepPartial<TEntity>>(
    createDto: TCreateDto,
    options?: CrudCreateOptions,
  ): Promise<TEntity>;
  update<TUpdateDto extends DeepPartial<TEntity>>(
    id: string,
    updateDto: TUpdateDto,
  ): Promise<TEntity>;
  delete(id: string): Promise<boolean>;
}

export abstract class CrudService<TEntity extends EntityBase>
  implements ICrudService<TEntity>
{
  constructor(
    private readonly repository: Repository<TEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  abstract getUniqueConstraints(): Array<keyof TEntity>;
  abstract getRelationFields(): RelationsMapping<TEntity>;

  async getList(
    options?: PaginationOptions,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TEntity[]> {
    return await this.repository.find({
      ...this.applyPagination(options),
      relations,
    });
  }

  async getPaginatedList(
    options?: PaginationOptions,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<PaginationDto<TEntity>> {
    options = this.checkPaginationOptions(options);
    const [entities, count] = await this.repository.findAndCount({
      ...this.applyPagination(options),
      relations,
    });
    return {
      total: count,
      limit: options.limit,
      page: options.page,
      items: entities,
    };
  }

  async getById(
    id: string,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TEntity> {
    const findOptions: FindOptionsWhere<EntityBase> = { id };
    return await this.repository.findOne({
      where: findOptions as FindOptionsWhere<TEntity>,
      relations,
    });
  }

  async create<TCreateDto extends DeepPartial<TEntity>>(
    createDto: TCreateDto,
    options?: CrudCreateOptions,
  ): Promise<TEntity> {
    if (options === undefined) options = new CrudCreateOptions();
    const findOptions: FindOptionsWhere<TEntity> = {};
    this.getUniqueConstraints().forEach((key) => {
      findOptions[key.toString()] = createDto[key.toString()];
    });
    const entity: TEntity | null = await this.repository.findOneBy(findOptions);
    if (entity !== null) return null;
    if (options.checkRelations) {
      const relationKeys: string[] = Object.keys(this.getRelationFields());
      for (const key of relationKeys) {
        if (createDto[key] !== undefined) {
          const relationRepository: Repository<EntityBase> =
            this.entityManager.getRepository(this.getRelationFields()[key]);
          const relation: EntityBase | null = await relationRepository.findOne({
            where: { id: createDto[key] },
          });
          if (relation === null)
            throw new HttpException(
              `Invalid value for '${key}' relation`,
              HttpStatus.NOT_FOUND,
            );
        }
      }
    }
    return await this.repository.save(createDto);
  }

  async update<TUpdateDto extends DeepPartial<TEntity>>(
    id: string,
    updateDto: TUpdateDto,
  ): Promise<TEntity> {
    const entity: TEntity = await this.getById(id);
    if (!entity) return null;
    return await this.repository.save({ ...entity, ...updateDto });
  }

  async delete(id: string): Promise<boolean> {
    return (await this.repository.delete(id)).affected === 1;
  }

  checkPaginationOptions(options?: PaginationOptions): PaginationOptions {
    if (options === undefined) options = DEFAULT_PAGINATION_OPTIONS;
    if (options.limit === undefined)
      options.limit = DEFAULT_PAGINATION_OPTIONS.limit;
    if (options.page === undefined)
      options.page = DEFAULT_PAGINATION_OPTIONS.page;
    return options;
  }

  applyPagination(options: PaginationOptions): FindManyOptions<TEntity> {
    options = this.checkPaginationOptions(options);
    return {
      skip: options.limit * options.page,
      take: options.limit,
    };
  }
}
