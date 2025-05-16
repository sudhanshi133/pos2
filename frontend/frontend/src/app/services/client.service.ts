import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { Client, ClientForm } from '../models/client.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ClientListResponse {
  clientDataList: {
    clientName: string;
  }[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:9001/pos/api/client';

  constructor(private http: HttpClient) {
    console.log('ClientService constructor called');
  }

  getAllClients(page: number = 0): Observable<PageResponse<Client>> {
    const url = `${this.apiUrl}/get?page=${page}&size=10`;
    console.log('Making request to:', url);
    console.log('Full URL:', url);
    console.log('Page requested:', page);
    
    return this.http.get<ClientListResponse>(url)
      .pipe(
        tap(response => {
          console.log('Raw HTTP response:', JSON.stringify(response, null, 2));
        }),
        map(response => {
          if (!response || !response.clientDataList) {
            console.error('Invalid response format:', JSON.stringify(response, null, 2));
            throw new Error('Invalid response format from server');
          }

          console.log('Server response:', JSON.stringify(response, null, 2));
          
          // If we get a full page (10 items), there might be more pages
          const hasMorePages = response.clientDataList.length === 10;
          const totalPages = hasMorePages ? page + 2 : page + 1;
          
          console.log('Calculated pagination:', {
            hasMorePages,
            totalPages,
            currentPage: page,
            itemsInResponse: response.clientDataList.length
          });

          const mappedResponse = {
            content: response.clientDataList.map(client => ({
              clientName: client.clientName
            })),
            totalElements: response.clientDataList.length,
            totalPages: totalPages,
            size: 10,
            number: page
          };
          console.log('Mapped response:', JSON.stringify(mappedResponse, null, 2));
          return mappedResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching clients:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error details:', JSON.stringify(error.error, null, 2));
          return throwError(() => error);
        })
      );
  }

  addClient(form: ClientForm): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/add`, form);
  }

  updateClient(originalClientName: string, form: ClientForm): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update/${originalClientName}`, form);
  }

  deleteClient(clientName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${clientName}`);
  }

  searchClients(searchTerm: string): Observable<PageResponse<Client>> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(searchTerm)}`;
    console.log('Making search request to:', url);
    
    return this.http.get<ClientListResponse>(url)
      .pipe(
        map(response => {
          if (!response || !response.clientDataList) {
            throw new Error('Invalid response format from server');
          }

          return {
            content: response.clientDataList.map(client => ({
              clientName: client.clientName
            })),
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            size: 10,
            number: 0
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error searching clients:', error);
          return throwError(() => error);
        })
      );
  }
} 