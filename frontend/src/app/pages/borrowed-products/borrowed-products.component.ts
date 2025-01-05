import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ReturnDialogComponent } from '../../components/return-dialog/return-dialog.component';
import { ProductService } from '../../services/product/product.service';
import { PageResponseBorrowedProductResponse } from '../../services/models/page-response-borrowed-product-response';
import { BorrowedProductResponse } from '../../services/models/borrowed-product-response';

@Component({
  selector: 'app-borrowed-products',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, FormsModule, PaginatorModule, ReturnDialogComponent],
  templateUrl: './borrowed-products.component.html',
  styleUrl: './borrowed-products.component.scss'
})
export class BorrowedProductsComponent implements OnInit {
  cover = 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  page = 0;
  size = 10;

  item:BorrowedProductResponse = {};
  visible = false;
  private productService = inject(ProductService);
  allProduct:BorrowedProductResponse[] = [];
  
  ngOnInit() {
    this.findAllBorrowedProducts();
  }

  onPageChange(event: PaginatorState) {
    this.page = event.first as number;
    this.size = event.rows as number;
    this.findAllBorrowedProducts();
  }

  findAllBorrowedProducts() {
    this.productService
      .findAllBorrowedProducts({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response: PageResponseBorrowedProductResponse) => {
          this.allProduct = response.content || [];
        },
      });
  }
  getSeverity(product: BorrowedProductResponse) {
    let status = product.returnedApproved? 'RETURNEDAPPROVED' :'RETURNED';
    switch (status) {
        case 'RETURNED':
            return 'warning';
        case 'RETURNEDAPPROVED':
            return 'success';
    }
    return 'success';
  }

  showDialog(product: BorrowedProductResponse) {
    console.log(product);
    this.item = product;
    console.log(this.item);
    this.visible = true;
  }
}
