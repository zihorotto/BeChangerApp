import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ProductService } from '../../services/product/product.service';
import { ProductResponse } from '../../services/models/product-response';
import { ProductRequest } from '../../services/models/product-request';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [DividerModule, InputSwitchModule, FormsModule, FileUploadModule,],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit{
  productRequest: ProductRequest = {
    available: false,
    brand: '',
    description: '',
    identifier: '',
    name: ''
  };

  selectedProductCover: Blob | undefined;
  selectedPicture: string | undefined;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)
  private productService = inject(ProductService);
  productId:number = 0;

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['productId'];
    
    if (this.productId) {
      this.productService.findProductById({
        'product-id': this.productId
      }).subscribe({
        next: (product: ProductResponse) => {
         this.productRequest = {
           id: product.id,
           name: product.name as string,
           brand: product.brand as string,
           identifier: product.identifier as string,
           description: product.description as string,
           available: product.available
         };
         this.selectedPicture='data:image/jpg;base64,' + product.coverImage;
        }
      });
    }
  }

  save() {
    console.log(this.productRequest);
    this.productService.saveProduct(this.productRequest).subscribe({
      next: (productId:number) => {
        this.router.navigate(['/products/my-products']);

        // this.productService.uploadProductCoverPicture({
        //   'product-id': productId,
        //   body: {
        //     file: this.selectedProductCover || new Blob()
        //   }
        // }).subscribe({
        //   next: () => {
        //     this.router.navigate(['/products/my-products']);
        //   }
        // });
      },
      error: (err) => {
        console.log(err.error);
        //this.errorMsg = err.error.validationErrors;
      }
    });
  }

  onUpload(event: any) {
    this.selectedProductCover = event.files[0];
    console.log(this.selectedProductCover);
    if (this.selectedProductCover) {

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedProductCover);
    }
  }
}
