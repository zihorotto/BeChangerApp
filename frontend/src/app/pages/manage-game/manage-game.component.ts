import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'app-manage-game',
  standalone: true,
  imports: [DividerModule, InputSwitchModule, FormsModule, FileUploadModule,],
  templateUrl: './manage-game.component.html',
  styleUrl: './manage-game.component.scss'
})
export class ManageGameComponent implements OnInit{
  gameRequest: any = {
    publisherName: '',
    upc: '',
    description: '',
    title: '',
    shareable: false,
  };

  selectedBookCover: any;
  selectedPicture: string | undefined;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['gameId'];
    if (bookId) {
    this.gameRequest = {
      id: '111',
      title: 'Edit',
      publisherName: 'Edit publisher',
      upc: '111222334444',
      description: 'Edit details',
      shareable: true
    }
  }
    // if (bookId) {
    //   this.bookService.findBookById({
    //     'book-id': bookId
    //   }).subscribe({
    //     next: (book) => {
    //      this.bookRequest = {
    //        id: book.id,
    //        title: book.title as string,
    //        authorName: book.authorName as string,
    //        isbn: book.isbn as string,
    //        synopsis: book.synopsis as string,
    //        shareable: book.shareable
    //      };
    //      this.selectedPicture='data:image/jpg;base64,' + book.cover;
    //     }
    //   });
    // }
  }

  save() {
    console.log(this.gameRequest);
    this.router.navigate(['/games/my-games']);
    // this.bookService.saveBook({
    //   body: this.bookRequest
    // }).subscribe({
    //   next: (bookId) => {
    //     this.bookService.uploadBookCoverPicture({
    //       'book-id': bookId,
    //       body: {
    //         file: this.selectedBookCover
    //       }
    //     }).subscribe({
    //       next: () => {
    //         this.router.navigate(['/books/my-books']);
    //       }
    //     });
    //   },
    //   error: (err) => {
    //     console.log(err.error);
    //     this.errorMsg = err.error.validationErrors;
    //   }
    // });
  }

  onUpload(event: any) {
    this.selectedBookCover = event.files[0];
    console.log(this.selectedBookCover);
    if (this.selectedBookCover) {

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }
}
