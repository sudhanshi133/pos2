import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {
  salesReports: any[] = [];
  dailyReports: any[] = [];
  filterForm: any = { startDate: '', endDate: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSalesReports();
    this.loadDailyReports();
  }

  loadSalesReports(): void {
    this.http.get<any>('/api/revenue/sales-report')
      .subscribe(data => {
        this.salesReports = data;
      });
  }

  loadFilteredSalesReports(): void {
    this.http.post<any>('/api/revenue/filtered-sales-report', this.filterForm)
      .subscribe(data => {
        this.salesReports = data;
      });
  }

  loadDailyReports(): void {
    this.http.get<any>('/api/reports/daily')
      .subscribe(data => {
        this.dailyReports = data;
      });
  }
} 