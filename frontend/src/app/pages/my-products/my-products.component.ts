import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { PageResponseProductResponse } from '../../types/page-response-product-response';
import { ProductResponse } from '../../types/product-response';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [
    ProductCardComponent,
    PaginatorModule,
    ButtonModule,
    ToastModule,
    ProgressSpinner,
  ],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.scss',
  providers: [MessageService],
})
export class MyProductsComponent implements OnInit {
  page = 0;
  first = 0;
  size = 10;
  numberOfProducts = 0;
  isLoaded = true;

  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  router = inject(Router);
  allProduct: WritableSignal<PageResponseProductResponse> =
    signal<PageResponseProductResponse>({});

  ngOnInit(): void {
    this.findAllProductsByOwner();
  }

  findAllProductsByOwner() {
    this.productService
      .findAllProductsByOwner({
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
    this.findAllProductsByOwner();
  }

  deleteProduct(product: ProductResponse) {
    this.productService
      .deleteProduct({
        'product-id': product.id as number,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You successfully deleted the ${product.name}`,
          });
          this.findAllProductsByOwner();
        },
      });
  }

  shareProduct(product: ProductResponse) {
    this.productService
      .updateAvailableStatus({
        'product-id': product.id as number,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You successfully shared the ${product.name}`,
          });
          this.findAllProductsByOwner();
        },
      });
  }

  editProduct(product: ProductResponse) {
    console.info('Editing product: ' + product.name);
    this.router.navigate(['products', 'manage', product.id]);
  }

  navigateToAddNewProduct() {
    this.router.navigate(['products', 'manage']);
  }
}
