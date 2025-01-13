import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ProductService } from '../../services/product/product.service';
import { ProductResponse } from '../../services/models/product-response';
import { ProductRequest } from '../../services/models/product-request';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [DividerModule, InputSwitchModule, FormsModule, FileUploadModule, ToastModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
  providers: [MessageService]
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
  private messageService = inject(MessageService);

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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `You successfully added ${this.productRequest.name}` });

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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
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
