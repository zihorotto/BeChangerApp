import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { PageResponseProductResponse } from '../../services/models/page-response-product-response';
import { ProductResponse } from '../../services/models/product-response';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [ProductCardComponent, PaginatorModule, ButtonModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.scss'
})
export class MyProductsComponent implements OnInit {
  page = 0;
  size = 10;

  allProduct: PageResponseProductResponse = {};
  private productService = inject(ProductService);
  router = inject(Router);

  ngOnInit(): void {
    this.findAllProductsByOwner()
  }

  findAllProductsByOwner() {
    this.productService.findAllProductsByOwner({
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (response:PageResponseProductResponse) => {
        this.allProduct = response;
      }
    });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.first as number;
    this.size = event.rows as number;
    this.findAllProductsByOwner();
  }

  archiveProduct(product: ProductResponse) {
    console.info('Archiving product: ' + product.name);
    this.productService.updateArchivedStatus({
      'product-id': product.id as number
    }).subscribe({
      next: () => {
        product.available = !product.available;
      }
    });
  }

  shareProduct(product: ProductResponse) {
    console.info('Sharing product: ' + product.name);
    this.productService.updateAvailableStatus({
      'product-id': product.id as number
    }).subscribe({
      next: () => {
        product.available = !product.available;
      }
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
