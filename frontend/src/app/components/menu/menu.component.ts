import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  items: MenuItem[] | undefined;

  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit() {
      this.items = [
          {
              label: 'Home',
              icon: 'pi pi-home',
              command: () => {
                this.router.navigate(['/games']);
            }
          },
          {
              label: 'My products',
              icon: 'pi pi-star',
              command: () => {
                this.router.navigate(['/games/my-games']);
            }
          },
          {
              label: 'My waiting list',
              icon: 'pi pi-star'
          },
          {
            label: 'My returned products',
            icon: 'pi pi-star',
            command: () => {
              this.router.navigate(['/games/returned-products']);
          }
          },
          {
            label: 'Borrowed products',
            icon: 'pi pi-star',
            command: () => {
              this.router.navigate(['/games/borrowed-products']);
          }
          },
      ]
  }

  async logout(){
    this.keycloakService.logout();
    // this.router.navigate(['/login']);
    // localStorage.removeItem('user');
  }
}
