import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../services/models/product-response';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CardModule, ButtonModule, RatingModule, FormsModule, TagModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit{
  @Input() product!: ProductResponse;
  @Input() manage: boolean = false;

  @Output() borrow: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
   @Output() share: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
   @Output() archive: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
   @Output() edit: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();

   tag = {
    isVisiable: false,
    title: '',
   }

  // @Output() private addToWaitingList: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
  // @Output() private details: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
  
  coverImage: string | undefined;

  constructor() {
    this.tag.isVisiable = false;
    this.coverImage = this.getCoverImage();
  }

  ngOnInit(): void {
    if(this.product.available){
      this.tag.isVisiable = true;
      this.tag.title = 'Shared';
    }
    if(this.product.archived){
      this.tag.isVisiable = true;
      this.tag.title = 'Archived';
    }
  }

  getCoverImage() {
    if(this.product && this.product.coverImage) {
      return `data:image/jpg;base64,${this.product.coverImage}`;
    }
    return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  }

  onBorrow() {
    this.borrow.emit(this.product);
  }

  onShare() {
    this.share.emit(this.product);
  }

  onArchive() {
    this.archive.emit(this.product);
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  // onAddToWaitingList() {
  //   this.addToWaitingList.emit(this.product);
  // }



  // onShowDetails() {
  //   this.details.emit(this.product);
  // }
  
}
