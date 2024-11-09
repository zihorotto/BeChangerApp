import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputSwitchModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: Storage,
      useValue: localStorage,
    },
  ],
})
export class AppComponent {
  title = 'game-network-ui';

  defaultTheme = 'theme-dark.css';
  protected storage = inject(Storage);

  #document = inject(DOCUMENT);
  isDarkMode = true;

  linkElement = this.#document.getElementById(
    'app-theme',
  ) as HTMLLinkElement;

  constructor() {
     this.linkElement.href = this.storage.getItem('THEME') || this.defaultTheme;
     this.isDarkMode = this.linkElement.href.includes('dark');
  }


  toggleLightDark() {
    if (!this.isDarkMode) {
      this.linkElement.href = 'theme-dark.css';
      this.storage.setItem('THEME', 'theme-dark.css');
      this.isDarkMode = true;
    } else {
      this.linkElement.href = 'theme-light.css';
      this.storage.setItem('THEME', 'theme-light.css');
      this.isDarkMode = false;
    }
  }


}
