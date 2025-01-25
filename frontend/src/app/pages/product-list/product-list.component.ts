import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductService } from '../../services/product/product.service';
import { PageResponseProductResponse } from '../../services/models/page-response-product-response';
import { ProductResponse } from '../../services/models/product-response';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, PaginatorModule, ToastModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [MessageService]
})
export class ProductListComponent implements OnInit {
  page = 0;
  size = 10;

  allProduct: PageResponseProductResponse = {};
  private productService = inject(ProductService);
  private messageService = inject(MessageService);

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
    this.productService.borrowProduct({
      'product-id': product.id as number
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `You successfully brrowed ${product.name}` });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error });
      }
    });
  }
}
