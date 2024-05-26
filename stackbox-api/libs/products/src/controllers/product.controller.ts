import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../common/src';
import {
  DeleteResponse,
  PaginationDto,
  PaginationOptions,
} from '../../../common/src/models/common.models';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto, ProductUpdateDto } from '../models/products.models';
import { ProductService } from '../services/product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiPaginatedResponse(ProductEntity)
  async getProductsPaginated(
    @Query() options?: PaginationOptions,
  ): Promise<PaginationDto<ProductEntity>> {
    return await this.productService.getPaginatedList(options);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse()
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductEntity> {
    const productEntity: ProductEntity | null =
      await this.productService.getById(id);
    if (productEntity === null)
      throw new NotFoundException(`Product with id ${id} not found`);
    return productEntity;
  }

  @Post()
  @ApiOkResponse({ type: ProductEntity })
  @ApiConflictResponse()
  async createProduct(
    @Body() productCreateDto: ProductCreateDto,
  ): Promise<ProductEntity> {
    const productEntity: ProductEntity | null =
      await this.productService.create(productCreateDto);
    if (productEntity === null)
      throw new ConflictException('Product with the same name already exists');
    return productEntity;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse()
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productCreateDto: ProductUpdateDto,
  ): Promise<ProductEntity> {
    const productEntity: ProductEntity | null =
      await this.productService.update(id, productCreateDto);
    if (productEntity === null)
      throw new NotFoundException(`Product with id ${id} not found`);
    return productEntity;
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteResponse })
  @ApiNotFoundResponse()
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteResponse> {
    const result: boolean = await this.productService.delete(id);
    if (!result) throw new NotFoundException(`Product with id ${id} not found`);
    return { id };
  }
}
