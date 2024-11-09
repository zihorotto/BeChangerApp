import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerRequest: any = {
    email: '',
    firstname: '',
    lastname: '',
    password: '',
  }

  private router = inject(Router);
  private authService = inject(AuthenticationService)
  private messageService = inject(MessageService);

  register(){
    this.messageService.clear();
    this.validate();
    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        this.router.navigate(['/activate-account']);
      },
      error: (error:any) => {
        console.log(error);
        // const errors:any = error.error.validationErrors;
        // errors.forEach((error:string) => {
        //   this.messageService.add({severity:'error', detail: error});
        // });
      }
    })
  }

  validate() {
    if(this.registerRequest.firstname === ''){
      this.messageService.add({severity:'error', detail:'First name is required'});
    }
    if(this.registerRequest.lastname === ''){
      this.messageService.add({severity:'error', detail:'Last name is required'});
    }
    if(this.registerRequest.email === ''){
      this.messageService.add({severity:'error', detail:'Email is required'});
    }
    if(this.registerRequest.password === ''){
      this.messageService.add({severity:'error', detail:'Password is required'});
    }
  }
}
