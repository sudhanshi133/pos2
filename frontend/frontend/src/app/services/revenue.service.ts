import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RevenueData {
  clientName: string;
  productName: string;
  barcode: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface RevenueListData {
  list: RevenueData[];
}

export interface SalesReportFilterForm {
  startDate: string;
  endDate: string;
  clientName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private apiUrl = 'http://localhost:9001/pos/api/revenue';

  constructor(private http: HttpClient) {}

  getMonthlyProductRevenue(): Observable<RevenueListData> {
    return this.http.get<RevenueListData>(`${this.apiUrl}/sales-report`);
  }

  getFilteredSalesReport(form: SalesReportFilterForm): Observable<RevenueListData> {
    return this.http.post<RevenueListData>(`${this.apiUrl}/filtered-sales-report`, form);
  }
} 