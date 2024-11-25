import { Component, inject, OnInit } from '@angular/core';
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
import { KeycloakService } from '../../services/keycloak/keycloak.service';

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
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private keycloakService = inject(KeycloakService);

  async ngOnInit(): Promise<void> {
    await this.keycloakService.init();
    await this.keycloakService.login();
  }
}
