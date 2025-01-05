import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { BorrowedProductResponse } from '../../services/models/borrowed-product-response';

@Component({
  selector: 'app-return-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, InputTextareaModule, RatingModule],
  templateUrl: './return-dialog.component.html',
  styleUrl: './return-dialog.component.scss'
})
export class ReturnDialogComponent {
  @Input() visible: boolean = false;
  @Input() item:BorrowedProductResponse = {};

  value: string = '';
  rate: number = 0;
}
