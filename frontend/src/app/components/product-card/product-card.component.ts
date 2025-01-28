import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../types/product-response';
import { ScrollPanel } from 'primeng/scrollpanel';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    Card,
    ButtonModule,
    RatingModule,
    FormsModule,
    TagModule,
    CommonModule,
    ScrollPanel,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductResponse;
  @Input() manage: boolean = false;

  @Output() borrow: EventEmitter<ProductResponse> =
    new EventEmitter<ProductResponse>();
  @Output() share: EventEmitter<ProductResponse> =
    new EventEmitter<ProductResponse>();
  @Output() delete: EventEmitter<ProductResponse> =
    new EventEmitter<ProductResponse>();
  @Output() edit: EventEmitter<ProductResponse> =
    new EventEmitter<ProductResponse>();

  tagTitle = '';

  // @Output() private addToWaitingList: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();
  // @Output() private details: EventEmitter<ProductResponse> = new EventEmitter<ProductResponse>();

  coverImage: string | undefined;

  ngOnInit(): void {
    this.getTagTitle();
    this.coverImage = this.getCoverImage();
  }

  getTagTitle() {
    if (this.product.borrowed) {
      this.tagTitle = 'Borrowed';
    } else if (this.product.available) {
      this.tagTitle = this.manage ? 'Shared' : 'Available';
    } else {
      this.tagTitle = 'Not shared';
    }
  }

  getSeverity() {
    switch (this.tagTitle) {
      case 'Shared':
      case 'Available':
        return 'success';
      case 'Not shared':
        return 'danger';
      case 'Borrowed':
        return 'warn';
      default:
        return 'info';
    }
  }

  getCoverImage() {
    if (this.product && this.product.coverImage) {
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

  onDelete() {
    this.delete.emit(this.product);
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
