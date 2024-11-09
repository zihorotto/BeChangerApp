import { Component, inject, OnInit } from '@angular/core';
import { GameCardComponent } from "../game-card/game-card.component";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [GameCardComponent, PaginatorModule, ButtonModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.scss'
})
export class MyGamesComponent implements OnInit {
  page = 0;
  size = 10;
  gameResponse:any = {
    content: [
      {
        shareable: true,
        archived: false,
        title: 'Game 2',
        publisherName: 'Publisher 2',
        upc: '0987654321',
        owner: 'Owner 2',
        description: 'Game 2 offers a unique experience with its innovative gameplay mechanics and stunning visuals. The game world is rich and immersive, providing hours of entertainment and exploration.',
        rate: 4,
        cover: undefined,
      },
      {
        shareable: false,
        archived: true,
        title: 'Game 3',
        publisherName: 'Publisher 3',
        upc: '1122334455',
        owner: 'Owner 3',
        description: 'In Game 3, players are introduced to a dystopian world where survival is the key. The game features a gripping narrative and challenging missions that test your strategic thinking and problem-solving skills.',
        rate: 3,
        cover: undefined,
      },
      {
        shareable: true,
        archived: false,
        title: 'Game 4',
        publisherName: 'Publisher 4',
        upc: '2233445566',
        owner: 'Owner 4',
        description: 'Game 4 is a fantasy adventure that transports players to a magical realm filled with mythical creatures and epic battles. The game’s rich lore and detailed environments make it a must-play for fans of the genre.',
        rate: 5,
        cover: undefined,
      },
      {
        shareable: true,
        archived: false,
        title: 'Game 6',
        publisherName: 'Publisher 6',
        upc: '4455667788',
        owner: 'Owner 6',
        description: 'Game 6 combines elements of strategy and role-playing to create a unique gaming experience. The game’s complex mechanics and deep customization options provide endless replayability and strategic depth.',
        rate: 4,
        cover: undefined,
      }
    ]
  };

  router = inject(Router);

  ngOnInit(): void {
    this.findAllGames()
}

findAllGames() {
  // this.gameService.findAllGames({
  //   page: this.page,
  //   size: this.size,
  //  }).subscribe({
  //   next: (response:any) => {
  //     this.gameResponse = response;
  //   }
  //  });
}

  onPageChange(event: PaginatorState) {
    this.page = event.first as number;
    this.size = event.rows as number;
    this.findAllGames();
  }

  archiveGame(game: any) {
    console.info('Archiving game: ' + game.title);
    // this.bookService.updateArchivedStatus({
    //   'book-id': book.id as number
    // }).subscribe({
    //   next: () => {
    //     book.archived = !book.archived;
    //   }
    // });
  }

  shareGame(game: any) {
    console.info('Sharing game: ' + game.title);
    // this.bookService.updateShareableStatus({
    //   'book-id': book.id as number
    // }).subscribe({
    //   next: () => {
    //     book.shareable = !book.shareable;
    //   }
    // });
  }

  editGame(game: any) {
    console.info('Editing game: ' + game.title);
    this.router.navigate(['games', 'manage', game.upc]);
    // this.router.navigate(['books', 'manage', book.id]);
  }

  navigateToAddNewBook() {
    this.router.navigate(['games', 'manage']);
  }
}
