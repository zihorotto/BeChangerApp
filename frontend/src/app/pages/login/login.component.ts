import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    StyleClassModule,
    FormsModule,
    RippleModule,
    CommonModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {
    email: '',
    password: '',
  }

  private router = inject(Router);
  private authService = inject(AuthenticationService)
  private tokenService = inject(TokenService);
  private messageService = inject(MessageService);

  login(){
    this.messageService.clear();
    this.validate();
    this.authService.authenticate(this.authRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        debugger
        this.tokenService.token = response.token as string;
        this.router.navigate(['/games']);
      },
      error: (error:any) => {
        debugger
        if(error.error.validationErrors){
          const errors:any = error.error.validationErrors;
          errors.forEach((error:string) => {
            this.messageService.add({severity:'error', detail: error});
          });
        } else {
          this.messageService.add({severity:'error', detail: error.message});
        }
      }
    })
 }

  validate() {
    if(this.authRequest.email === ''){
      this.messageService.add({severity:'error', detail:'Email is required'});
    }
    if(this.authRequest.password === ''){
      this.messageService.add({severity:'error', detail:'Password is required'});
    }
  }
}
