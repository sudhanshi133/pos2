import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['clientName', 'actions'];
  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients(this.currentPage).subscribe({
      next: (response: PageResponse<Client>) => {
        this.clients = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Error loading clients', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onEdit(client: Client): void {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '400px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.updateClient(client.clientName, result).subscribe({
          next: () => {
            this.loadClients();
            this.snackBar.open('Client updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error) => {
            console.error('Error updating client:', error);
            this.snackBar.open('Error updating client', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }
} 