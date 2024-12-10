// src/app/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookService } from '../services/book.services';
import { Book } from '../models/book';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrl: './BookListComponent.css',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule
  ]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  displayedColumns: string[] = ['title', 'author', 'isbn', 'publicationDate', 'actions'];

  constructor(
    private bookService: BookService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.addBook(result).subscribe(() => {
          this.loadBooks();
        });
      }
    });
  }

  openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '400px',
      data: book
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && book.id) {
        this.bookService.updateBook(book.id, result).subscribe(() => {
          this.loadBooks();
        });
      }
    });
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }
}