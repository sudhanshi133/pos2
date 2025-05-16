import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SalesReportFilterForm {
  startDate: string;  // YYYY-MM-DD format
  endDate: string;    // YYYY-MM-DD format
}

export interface RevenueListData {
  // Add properties based on your backend response
  // This is a placeholder - update according to your actual data structure
  data: any[];
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getAllSalesReports(): Observable<RevenueListData> {
    return this.http.get<RevenueListData>(`${this.apiUrl}/sales-report`);
  }

  getFilteredSalesReports(filter: SalesReportFilterForm): Observable<RevenueListData> {
    return this.http.post<RevenueListData>(`${this.apiUrl}/filtered-sales-report`, filter);
  }
} 