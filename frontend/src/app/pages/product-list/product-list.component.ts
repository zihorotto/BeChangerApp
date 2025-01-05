import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductService } from '../../services/product/product.service';
import { PageResponseProductResponse } from '../../services/models/page-response-product-response';
import { ProductResponse } from '../../services/models/product-response';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, PaginatorModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  page = 0;
  size = 10;

  message:string = '';
  level:string = 'success';

  allProduct: PageResponseProductResponse = {};
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.findAllProduct();
  }

  findAllProduct() {
    this.productService
      .findAllProducts({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response: PageResponseProductResponse) => {
          this.allProduct = response;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.first as number;
    this.size = event.rows as number;
    this.findAllProduct();
  }

  borrowProduct(product: ProductResponse) {
    console.info('Borrowing product: ' + product.name);
    this.message = '';
    this.level = 'success';
    this.productService.borrowProduct({
      'product-id': product.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Product successfully added to your list';
      },
      error: (err) => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    });
  }
}
