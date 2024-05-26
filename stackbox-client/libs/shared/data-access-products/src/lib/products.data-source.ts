import { Injectable } from '@angular/core';
import {
  DeleteResponse,
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductsService,
} from '@stackbox/shared/api-stackbox';
import { IDataSource } from '@stackbox/shared/utils-store';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataSource
  implements IDataSource<Product, ProductCreateDto, ProductUpdateDto>
{
  constructor(private readonly productsService: ProductsService) {}

  getPaginatedList(
    options?:
      | { limit?: number | undefined; page?: number | undefined }
      | undefined
  ): Observable<Product[]> {
    return this.productsService
      .getProductsPaginated(options?.limit, options?.page)
      .pipe(map((paginatedProducts) => paginatedProducts.items));
  }

  getById(id: string): Observable<Product> {
    return this.productsService.getProductById(id);
  }

  create(createDto: ProductCreateDto): Observable<Product> {
    return this.productsService.createProduct(createDto);
  }

  update(id: string, updateDto: ProductUpdateDto): Observable<Product> {
    return this.productsService.updateProduct(id, updateDto);
  }

  delete(id: string): Observable<DeleteResponse> {
    return this.productsService.deleteProduct(id);
  }
}
