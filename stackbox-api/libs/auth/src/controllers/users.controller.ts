import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../common/src';
import {
  DeleteResponse,
  PaginationDto,
  PaginationOptions,
} from '../../../common/src/models/common.models';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiPaginatedResponse(UserEntity)
  async getUsersPaginated(
    @Query() options?: PaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.usersService.getPaginatedList(options);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserEntity> {
    const user: UserEntity | null = await this.usersService.getById(id);
    if (user === null)
      throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteResponse> {
    const result: boolean = await this.usersService.delete(id);
    if (!result) throw new NotFoundException(`User with id ${id} not found`);
    return { id };
  }
}
