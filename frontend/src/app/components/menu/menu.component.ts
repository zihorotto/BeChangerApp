import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule, ButtonModule, ToastModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MessageService],
})
export class MenuComponent {
  items: MenuItem[] | undefined;
  socketClient: any = null;
  private notificationSubscription: any;
  unreadNotificationsCount = 0;
  // notifications: Array<Notification> = [];
  notifications: Array<any> = [];

  private keycloakService = inject(KeycloakService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.navigationHandler();
    this.notificationHandler();
  }

  notificationHandler() {
    if (this.keycloakService.keycloak.tokenParsed?.sub) {
      let ws = new SockJS('http://localhost:8088/api/v1/ws');
      this.socketClient = Stomp.over(ws);
      this.socketClient.connect({'Authorization': 'Bearer ' + this.keycloakService.keycloak.token}, () => {
          this.notificationSubscription = this.socketClient.subscribe(
            `/user/${this.keycloakService.keycloak.tokenParsed?.sub}/notifications`,
            (message: any) => {
              const notification = JSON.parse(message.body);
              if (notification) {
                this.notifications.unshift(notification);
                switch (notification.status) {
                  case 'BORROWED':
                    this.messageService.add({ severity: 'success', summary: notification.bookTitle, detail: notification.message });
                    break;
                  case 'RETURNED':
                    this.messageService.add({ severity: 'info', summary: notification.bookTitle, detail: notification.message });
                    break;
                  case 'RETURN_APPROVED':
                    this.messageService.add({ severity: 'info', summary: notification.bookTitle, detail: notification.message });
                    break;
                }
                this.unreadNotificationsCount++;
              }


            }, () => {
              console.error('Error while connecting to webSocket');
            });
        }
      );
    }
  }

  navigationHandler() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['/products']);
        },
      },
      {
        label: 'My products',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/products/my-products']);
        },
      },
      {
        label: 'My products management',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/products/returned-products']);
        },
      },
      {
        label: 'Borrowed products',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/products/borrowed-products']);
        },
      },
    ];
  }

  async logout() {
    this.keycloakService.logout();
    // this.router.navigate(['/login']);
    // localStorage.removeItem('user');
  }
}
