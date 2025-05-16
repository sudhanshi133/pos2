import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, map, from, switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DailyReportForm {
  startDate: string;  // Will be formatted as YYYY-MM-DD
  endDate: string;    // Will be formatted as YYYY-MM-DD
}

export interface DailyReportData {
  date: string;
  orderCount: number;
  totalItems: number;
  revenue: number;
}

export interface DailyReportRequest {
  startDate: string;
  endDate: string;
}

export interface DailyReportListData {
  list: DailyReportData[];
}

@Injectable({
  providedIn: 'root'
})
export class DailyReportService {
  private apiUrl = 'http://localhost:9001/pos/api/reports';
  private downloadUrl = 'http://localhost:8080/api/order/invoice';

  constructor(private http: HttpClient) { }

  // Get all daily reports
  getAllDailyReports(): Observable<DailyReportListData> {
    console.log('Fetching reports from:', `${this.apiUrl}/daily`);
    return this.http.get<DailyReportListData>(`${this.apiUrl}/daily`).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('Error fetching reports:', error);
        throw error;
      })
    );
  }

  // Get filtered daily reports
  getFilteredDailyReports(filterForm: DailyReportForm): Observable<DailyReportListData> {
    console.log('Filtering reports with:', filterForm);
    return this.http.post<DailyReportListData>(`${this.apiUrl}/daily/filter`, filterForm).pipe(
      tap(response => console.log('Filter API Response:', response)),
      catchError(error => {
        console.error('Error filtering reports:', error);
        if (error.status === 405) {
          throw new Error('Invalid request method. Please try again.');
        }
        throw error;
      })
    );
  }

  downloadDailyReports(startDate: string, endDate: string): Observable<Blob> {
    const requestBody = { startDate, endDate };
    console.log('[DailyReportService] Starting report download:', {
      url: `${this.downloadUrl}/daily-report`,
      requestBody
    });

    return this.http.post(
      `${this.downloadUrl}/daily-report`,
      requestBody,
      {
        responseType: 'blob',
        observe: 'response',
        headers: new HttpHeaders({
          'Accept': 'application/pdf',
          'Content-Type': 'application/json'
        }),
        withCredentials: false
      }
    ).pipe(
      tap(response => {
        console.log('[DailyReportService] Response received:', {
          status: response.status,
          headers: {
            'content-type': response.headers.get('content-type'),
            'content-disposition': response.headers.get('content-disposition')
          }
        });
      }),
      switchMap(response => {
        // Check if the response is a JSON error message
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return new Observable<Blob>(observer => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const errorResponse = JSON.parse(reader.result as string);
                if (errorResponse.message === 'No records found for the selected date range') {
                  observer.error(new Error('No records exist for the selected date range'));
                } else {
                  observer.error(new Error(errorResponse.message || 'Error downloading report'));
                }
              } catch (e) {
                observer.error(new Error('Error processing server response'));
              }
            };
            reader.onerror = () => {
              observer.error(new Error('Error reading server response'));
            };
            if (response.body) {
              reader.readAsText(response.body);
            } else {
              observer.error(new Error('No records exist for the selected date range'));
            }
          });
        }

        if (!response.body || response.body.size === 0) {
          return throwError(() => new Error('No records exist for the selected date range'));
        }

        if (!contentType || !contentType.includes('application/pdf')) {
          return throwError(() => new Error('Server did not return a PDF file'));
        }

        // Get filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'daily_report.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        // Return the blob directly without creating a download link
        return of(response.body);
      }),
      catchError(error => {
        console.error('[DailyReportService] Error in download process:', {
          error,
          status: error.status,
          message: error.message
        });

        if (error.status === 0) {
          return throwError(() => new Error('Unable to connect to the server. Please check your network connection and CORS settings.'));
        }

        if (error.error instanceof Blob) {
          return new Observable<Blob>(observer => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const errorResponse = JSON.parse(reader.result as string);
                if (errorResponse.message === 'No records found for the selected date range') {
                  observer.error(new Error('No records exist for the selected date range'));
                } else {
                  observer.error(new Error(errorResponse.message || 'Error downloading report'));
                }
              } catch (e) {
                observer.error(new Error('Error processing server response'));
              }
            };
            reader.onerror = () => {
              observer.error(new Error('Error reading server response'));
            };
            reader.readAsText(error.error);
          });
        }

        return throwError(() => new Error(error.message || 'Error downloading report'));
      })
    );
  }
} 