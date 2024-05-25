import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class DeleteResponse {
  @ApiProperty()
  id: string;
}

export const DEFAULT_PAGINATION_LIMIT = 30;
export const MAX_PAGINATION_LIMIT = 5000;
export const DEFAULT_PAGINATION_PAGE = 0;
export const MAX_PAGINATION_PAGE = 5000;

export class PaginationOptions {
  @IsOptional()
  @IsNumber()
  @Max(MAX_PAGINATION_LIMIT)
  @Min(1)
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    default: DEFAULT_PAGINATION_LIMIT,
    maximum: MAX_PAGINATION_LIMIT,
  })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Max(MAX_PAGINATION_PAGE)
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    required: false,
    default: DEFAULT_PAGINATION_PAGE,
    maximum: MAX_PAGINATION_PAGE,
  })
  page?: number;
}

export const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
  limit: DEFAULT_PAGINATION_LIMIT,
  page: DEFAULT_PAGINATION_PAGE,
};

export class PaginationDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  items: TData[];
}
