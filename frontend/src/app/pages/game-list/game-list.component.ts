import { Component, OnInit } from '@angular/core';
import { GameCardComponent } from "../../components/game-card/game-card.component";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GameCardComponent, PaginatorModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit {
  page = 0;
  size = 10;
  gameResponse:any = {
    content: [
      {
        shareable: true,
        archived: false,
        title: 'Game 1',
        publisherName: 'Publisher 1',
        upc: '1234567890',
        owner: 'Owner 1',
        description: 'This is the description for Game 1. It is an exciting game that takes you on an adventure through various challenges and quests. The storyline is captivating and keeps you engaged throughout the gameplay.',
        rate: 5,
        cover: undefined,
      },
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
        shareable: false,
        archived: true,
        title: 'Game 5',
        publisherName: 'Publisher 5',
        upc: '3344556677',
        owner: 'Owner 5',
        description: 'Game 5 is a fast-paced action game that keeps players on the edge of their seats. With its intense combat system and dynamic storyline, it offers a thrilling experience from start to finish.',
        rate: 2,
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

  //private gameService = inject(gameService);

  ngOnInit(): void {
      this.findAllGames()
  }

  findAllGames() {
    // this.gameService.findAllGamesByOwner({
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

  borrowGame(game: any) {
    console.info('Borrowing game: ' + game.title);
    // this.message = '';
    // this.level = 'success';
    // this.bookService.borrowBook({
    //   'book-id': book.id as number
    // }).subscribe({
    //   next: () => {
    //     this.level = 'success';
    //     this.message = 'Book successfully added to your list';
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.level = 'error';
    //     this.message = err.error.error;
    //   }
    // });
  }

}
