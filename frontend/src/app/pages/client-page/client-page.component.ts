import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit {
  clients: any[] = [];
  newClient: any = { name: '', email: '', phone: '' };
  page: number = 0;
  size: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.http.get<any>(`/api/client/get?page=${this.page}&size=${this.size}`)
      .subscribe(data => {
        this.clients = data.clients;
      });
  }

  addClient(): void {
    this.http.post('/api/client/add', this.newClient)
      .subscribe(() => {
        this.loadClients();
        this.newClient = { name: '', email: '', phone: '' };
      });
  }

  updateClient(clientName: string, client: any): void {
    this.http.put(`/api/client/update/${clientName}`, client)
      .subscribe(() => {
        this.loadClients();
      });
  }
} 