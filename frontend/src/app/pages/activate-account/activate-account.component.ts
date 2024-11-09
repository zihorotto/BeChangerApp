import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    FormsModule,
    InputOtpModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
  value: string = '';

  isOkay:boolean = true;
  isSubmitted:boolean = false;

  private router = inject(Router);
  private authService = inject(AuthenticationService);

  confirmAccount() {
    this.authService.confirm(this.value).subscribe({
      next: () => {
        //this.isOkay = true;
        this.isSubmitted = true;
      },
      error: (error:any) => {
        this.isSubmitted = true;
        this.isOkay = false;
      }
    })
  }

  login(){
    this.router.navigate(['/login']);
  }

  tryAgain(){
    this.isSubmitted = false;
  }
}
