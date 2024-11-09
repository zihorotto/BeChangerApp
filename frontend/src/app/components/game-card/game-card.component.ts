import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CardModule, ButtonModule, RatingModule, FormsModule, TagModule, CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent implements OnInit{
  @Input() game: any;
  @Input() manage: boolean = false;

  @Output() borrow: EventEmitter<any> = new EventEmitter<any>();
   @Output() share: EventEmitter<any> = new EventEmitter<any>();
   @Output() archive: EventEmitter<any> = new EventEmitter<any>();
   @Output() edit: EventEmitter<any> = new EventEmitter<any>();

   tag = {
    isVisiable: false,
    title: '',
   }

  // @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  
  gameCover: string | undefined;

  constructor() {
    this.tag.isVisiable = false;
    this.gameCover = this.getGameCover();
  }

  ngOnInit(): void {
    if(this.game.shareable){
      this.tag.isVisiable = true;
      this.tag.title = 'Shared';
    }
    if(this.game.archived){
      this.tag.isVisiable = true;
      this.tag.title = 'Archived';
    }
  }

  getGameCover() {
    if(this.game && this.game.cover) {
      return `data:image/jpg;base64,${this.game.cover}`;
    }
    return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  }

  onBorrow() {
    this.borrow.emit(this.game);
  }

  onShare() {
    this.share.emit(this.game);
  }

  onArchive() {
    this.archive.emit(this.game);
  }

  onEdit() {
    this.edit.emit(this.game);
  }

  // onAddToWaitingList() {
  //   this.addToWaitingList.emit(this._book);
  // }



  // onShowDetails() {
  //   this.details.emit(this._book);
  // }
  
}
