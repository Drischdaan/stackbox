import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IEntityBase } from '../../../database/src';

export interface IProduct {
  name: string;
  description: string;
}

export interface IProductEntity extends IEntityBase, IProduct {}

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty()
  description: string;
}

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  description?: string;
}
