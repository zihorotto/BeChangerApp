import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ReturnDialogComponent } from '../../components/return-dialog/return-dialog.component';
import { BorrowedProductResponse } from '../../services/models/borrowed-product-response';
import { ProductService } from '../../services/product/product.service';
import { PageResponseBorrowedProductResponse } from '../../services/models/page-response-borrowed-product-response';

@Component({
  selector: 'app-returned-products',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    PaginatorModule,
    ReturnDialogComponent,
  ],
  templateUrl: './returned-products.component.html',
  styleUrl: './returned-products.component.scss',
})
export class ReturnedProductsComponent implements OnInit {
  cover = 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  page = 0;
  size = 10;

  allProducts: BorrowedProductResponse[] = [];

  item: BorrowedProductResponse = {};
  visible = false;

  private productService = inject(ProductService);

  ngOnInit() {
    this.findAllReturnedProducts;
  }

  onPageChange(event: PaginatorState) {
    this.page = event.first as number;
    this.size = event.rows as number;
    this.findAllReturnedProducts();
  }

  findAllReturnedProducts() {
    this.productService
      .findAllReturnedProducts({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response: PageResponseBorrowedProductResponse) => {
          console.log(response);
          this.allProducts = response.content || [];
        },
      });
  }

  approve(product: BorrowedProductResponse) {
    console.log(product);
    this.item = product;
    console.log(this.item);
    // this.visible = true;
  }
}
