import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { BorrowedProductResponse } from '../../types/borrowed-product-response';
import { ProductService } from '../../services/product/product.service';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { FeedbackRequest } from '../../types/feedback-request';

@Component({
  selector: 'app-return-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, RatingModule],
  templateUrl: './return-dialog.component.html',
  styleUrl: './return-dialog.component.scss',
})
export class ReturnDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() item: BorrowedProductResponse = {};
  @Output() visibleChange = new EventEmitter<boolean>();
  feedbackRequest: FeedbackRequest = { productId: 0, comment: '', note: 0 };

  private productService = inject(ProductService);
  private feedbackService = inject(FeedbackService);

  ngOnInit(): void {
    this.feedbackRequest.productId = this.item.id as number;
  }

  closeDialog() {
    this.visibleChange.emit(false);
  }

  returnProduct() {
    this.productService
      .returnBorrowProduct({
        'product-id': this.item.id as number,
      })
      .subscribe({
        next: () => {
          this.closeDialog();
          if (
            this.feedbackRequest.comment.length > 0 &&
            this.feedbackRequest.note
          ) {
            this.giveFeedback();
          }
        },
      });
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback(this.feedbackRequest).subscribe({
      next: () => {},
    });
  }
}
