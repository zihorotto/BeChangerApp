import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductService } from '../../services/product/product.service';
import { PageResponseProductResponse } from '../../types/page-response-product-response';
import { ProductResponse } from '../../types/product-response';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    PaginatorModule,
    ToastModule,
    ProgressSpinner,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [MessageService],
})
export class ProductListComponent implements OnInit {
  page = 0;
  first = 0;
  size = 10;
  numberOfProducts = 0;
  isLoaded = true;

  allProduct: WritableSignal<PageResponseProductResponse> =
    signal<PageResponseProductResponse>({});
  private productService = inject(ProductService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.findAllProduct();
  }

  findAllProduct() {
    this.isLoaded = true;
    this.productService
      .findAllProducts({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response: PageResponseProductResponse) => {
          this.allProduct.set(response);
          this.numberOfProducts = response.totalElements as number;
          this.isLoaded = false;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.page as number;
    this.first = event.first as number;
    this.size = event.rows as number;
    this.findAllProduct();
  }

  borrowProduct(product: ProductResponse) {
    this.productService
      .borrowProduct({
        'product-id': product.id as number,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You successfully brrowed ${product.name}`,
          });
          this.findAllProduct();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.error,
          });
        },
      });
  }
}
