import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesReportService, RevenueListData, SalesReportFilterForm } from '../../services/sales-report.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesReportsComponent implements OnInit {
  reports: RevenueListData | null = null;
  loading = false;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private salesReportService: SalesReportService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('SalesReportsComponent initialized');
    this.loadReports();
  }

  loadReports(): void {
    console.log('Loading all sales reports...');
    this.loading = true;
    this.salesReportService.getAllSalesReports().subscribe({
      next: (data) => {
        console.log('Received sales reports:', data);
        this.reports = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sales reports:', error);
        this.toastService.show('Error loading sales reports', 'error');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    console.log('Applying filter...');
    if (!this.startDate || !this.endDate) {
      this.toastService.show('Please select both start and end dates', 'error');
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.toastService.show('Start date cannot be after end date', 'error');
      return;
    }

    const filter: SalesReportFilterForm = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    console.log('Filter criteria:', filter);
    this.loading = true;

    this.salesReportService.getFilteredSalesReports(filter).subscribe({
      next: (data) => {
        console.log('Filtered sales reports:', data);
        this.reports = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering sales reports:', error);
        this.toastService.show('Error filtering sales reports', 'error');
        this.loading = false;
      }
    });
  }

  resetFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.loadReports();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMaxDate(): string {
    return this.getTodayDate();
  }
} 