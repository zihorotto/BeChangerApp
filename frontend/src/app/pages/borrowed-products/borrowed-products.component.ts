import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ReturnDialogComponent } from '../../components/return-dialog/return-dialog.component';

@Component({
  selector: 'app-borrowed-products',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, FormsModule, PaginatorModule, ReturnDialogComponent],
  templateUrl: './borrowed-products.component.html',
  styleUrl: './borrowed-products.component.scss'
})
export class BorrowedProductsComponent {
  cover = 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  page = 0;
  size = 10;
  product: any = 
  [
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
        returned: true,
        returnedApproved: false,
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
        returned: false,
        returnedApproved: false,
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
        returned: false,
        returnedApproved: false,
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
        returned: false,
        returnedApproved: false,
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
        returned: true,
        returnedApproved: false,
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
        returned: true,
        returnedApproved: true,
      }
    ];

    item:any;
    visible = false;

    onPageChange(event: PaginatorState) {
      this.page = event.first as number;
      this.size = event.rows as number;
      //this.findAllGames();
    }
  
    getSeverity(product: any) {
      let status = product.returnedApproved? 'RETURNEDAPPROVED' :'RETURNED';
      switch (status) {
          case 'RETURNED':
              return 'warning';
          case 'RETURNEDAPPROVED':
              return 'success';
      }
      return 'success';
  }

  showDialog(product: any) {
    console.log(product);
    this.item = product;
    console.log(this.item);
    this.visible = true;
  }
}
