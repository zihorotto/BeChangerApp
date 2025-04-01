import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponseProductResponse } from '../../types/page-response-product-response';
import { ProductRequest } from '../../types/product-request';
import { ProductResponse } from '../../types/product-response';
import { PageResponseBorrowedProductResponse } from '../../types/page-response-borrowed-product-response';

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface UploadProductCoverPicture$Params {
  'product-id': number;
  body?: {
    file: Blob;
  };
}

export interface productId {
  'product-id': number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(protected config: ApiConfiguration, protected http: HttpClient) {
    this.rootUrl = config.rootUrl;
  }

  rootUrl: string;

  findAllProducts(
    params?: PaginationParams
  ): Observable<PageResponseProductResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size.toString());
      }
    }

    return this.http.get<PageResponseProductResponse>(
      `${this.rootUrl}/products`,
      { params: httpParams }
    );
  }

  saveProduct(params: ProductRequest): Observable<number> {
    return this.http.post<number>(`${this.rootUrl}/products`, params);
  }

  uploadProductCoverPicture(
    params: UploadProductCoverPicture$Params
  ): Observable<{}> {
    const formData = new FormData();
    formData.append('file', params.body?.file || new Blob(), 'filename.jpg');
    return this.http.post<{}>(
      `${this.rootUrl}/products/cover/${params['product-id']}`,
      formData
    );
  }

  borrowProduct(params: productId): Observable<number> {
    return this.http.post<number>(
      `${this.rootUrl}/products/borrow/${params['product-id']}`,
      null
    );
  }

  returnBorrowProduct(params: productId): Observable<number> {
    return this.http.patch<number>(
      `${this.rootUrl}/products/borrow/return/${params['product-id']}`,
      null
    );
  }

  approveReturnBorrowProduct(params: productId): Observable<number> {
    return this.http.patch<number>(
      `${this.rootUrl}/products/borrow/return/approve/${params['product-id']}`,
      null
    );
  }

  updateAvailableStatus(params: productId): Observable<number> {
    return this.http.patch<number>(
      `${this.rootUrl}/products/available/${params['product-id']}`,
      null
    );
  }

  deleteProduct(params: productId): Observable<number> {
    return this.http.delete<number>(
      `${this.rootUrl}/products/${params['product-id']}`
    );
  }

  findProductById(params: productId): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.rootUrl}/products/${params['product-id']}`
    );
  }

  findAllReturnedProducts(
    params?: PaginationParams
  ): Observable<PageResponseBorrowedProductResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size.toString());
      }
    }

    return this.http.get<PageResponseBorrowedProductResponse>(
      `${this.rootUrl}/products/returner`,
      { params: httpParams }
    );
  }

  findAllProductsByOwner(
    params?: PaginationParams
  ): Observable<PageResponseProductResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size.toString());
      }
    }

    return this.http.get<PageResponseProductResponse>(
      `${this.rootUrl}/products/owner`,
      { params: httpParams }
    );
  }

  findAllBorrowedProducts(
    params?: PaginationParams
  ): Observable<PageResponseBorrowedProductResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size.toString());
      }
    }

    return this.http.get<PageResponseBorrowedProductResponse>(
      `${this.rootUrl}/products/borrowed`,
      { params: httpParams }
    );
  }
}
