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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  templateUrl: './returned-products.component.html',
  styleUrl: './returned-products.component.scss',
  providers: [MessageService]
})
export class ReturnedProductsComponent implements OnInit {
  cover = 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  page = 0;
  size = 10;

  allProducts: BorrowedProductResponse[] = [];

  item: BorrowedProductResponse = {};

  private productService = inject(ProductService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.findAllReturnedProducts();
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
          this.allProducts = response.content || [];
        },
      });
  }

  approve(product: BorrowedProductResponse) {
    if (!product.returned) {
      return;
    }
    this.item = product;
    this.productService
      .approveReturnBorrowProduct({
        'product-id': this.item.id as number,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You successfully approve that ${product.name} returned`,
          });
          this.findAllReturnedProducts();
        },
      });
  }
}
