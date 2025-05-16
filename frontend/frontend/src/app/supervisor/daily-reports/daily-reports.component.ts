import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyReportService, DailyReportData, DailyReportForm } from '../../services/daily-report.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ToastComponent]
})
export class DailyReportsComponent implements OnInit {
  reports: DailyReportData[] = [];
  loading: boolean = false;
  filterForm: DailyReportForm = {
    startDate: '',
    endDate: ''
  };

  constructor(
    private dailyReportService: DailyReportService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadReports();
  }

  loadReports(): void {
    console.log('Loading reports...');
    this.loading = true;
    this.dailyReportService.getAllDailyReports().subscribe({
      next: (data) => {
        console.log('Received reports:', data);
        if (data && data.list) {
          this.reports = data.list;
          console.log('Reports array updated:', this.reports);
        } else {
          console.warn('No reports data received');
          this.reports = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.toastService.show('Error loading reports: ' + (error.message || 'Unknown error'), 'error');
        this.loading = false;
        this.reports = [];
      }
    });
  }

  applyFilter(): void {
    console.log('Applying filter:', this.filterForm);
    
    // If no dates are selected, show all reports
    if (!this.filterForm.startDate && !this.filterForm.endDate) {
      console.log('No dates selected, loading all reports');
      this.loadReports();
      return;
    }

    // If only start date is selected, use today's date as end date
    if (this.filterForm.startDate && !this.filterForm.endDate) {
      this.filterForm.endDate = this.getTodayDate();
    }

    // Validate date range
    const startDate = new Date(this.filterForm.startDate);
    const endDate = new Date(this.filterForm.endDate);

    if (startDate > endDate) {
      console.log('Invalid date range');
      this.toastService.show('Start date cannot be after end date', 'info');
      return;
    }

    // Format dates to match backend expectations (YYYY-MM-DD)
    const formattedFilterForm: DailyReportForm = {
      startDate: this.filterForm.startDate,
      endDate: this.filterForm.endDate
    };

    console.log('Fetching filtered reports with:', formattedFilterForm);
    this.loading = true;
    this.dailyReportService.getFilteredDailyReports(formattedFilterForm).subscribe({
      next: (data) => {
        console.log('Received filtered reports:', data);
        if (data && data.list) {
          this.reports = data.list;
          console.log('Reports array updated with filtered data:', this.reports);
        } else {
          console.warn('No filtered reports data received');
          this.reports = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering reports:', error);
        this.toastService.show('Error filtering reports: ' + (error.message || 'Unknown error'), 'error');
        this.loading = false;
        this.reports = [];
      }
    });
  }

  resetFilter(): void {
    console.log('Resetting filter');
    this.filterForm = {
      startDate: '',
      endDate: ''
    };
    this.loadReports();
  }

  // Helper method to get today's date in YYYY-MM-DD format
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Helper method to get max date (today) for the date inputs
  getMaxDate(): string {
    return this.getTodayDate();
  }

  downloadReports(): void {
    if (!this.filterForm.startDate) {
      this.toastService.show('Please select at least a start date', 'error');
      return;
    }

    // If only start date is selected, use today's date as end date
    const endDate = this.filterForm.endDate || this.getTodayDate();
    this.loading = true;
    console.log('[DailyReportsComponent] Starting report download:', {
      startDate: this.filterForm.startDate,
      endDate: endDate
    });

    // First check if there's data for the selected date range
    this.dailyReportService.getFilteredDailyReports({
      startDate: this.filterForm.startDate,
      endDate: endDate
    }).subscribe({
      next: (data) => {
        if (!data || !data.list || data.list.length === 0) {
          this.toastService.show('No records exist for the selected date range', 'error');
          this.loading = false;
          return;
        }

        // If data exists, proceed with download
        this.dailyReportService.downloadDailyReports(this.filterForm.startDate, endDate)
          .subscribe({
            next: (blob: Blob) => {
              try {
                console.log('[DailyReportsComponent] Received blob:', {
                  size: blob.size,
                  type: blob.type
                });

                if (blob.size === 0) {
                  this.toastService.show('No records exist for the selected date range', 'error');
                  return;
                }

                // Create a blob URL
                const url = window.URL.createObjectURL(blob);
                console.log('[DailyReportsComponent] Created blob URL:', url);
                
                // Create a temporary link element
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.download = `daily-report-${this.filterForm.startDate}-to-${endDate}.pdf`;
                
                // Append to body
                document.body.appendChild(link);
                
                // Trigger click event
                const clickEvent = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                link.dispatchEvent(clickEvent);
                
                // Cleanup
                setTimeout(() => {
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                  console.log('[DailyReportsComponent] Cleaned up download resources');
                }, 1000);

                this.toastService.show('Report downloaded successfully', 'success');
              } catch (error) {
                console.error('[DailyReportsComponent] Error creating download:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                this.toastService.show('Error creating download: ' + errorMessage, 'error');
              } finally {
                this.loading = false;
              }
            },
            error: (error: any) => {
              console.error('[DailyReportsComponent] Error downloading report:', {
                error,
                status: (error as any).status,
                message: (error as any).message,
                errorType: (error as any).error instanceof Blob ? 'Blob' : typeof (error as any).error
              });

              let errorMessage = 'Error downloading report';
              if ((error as any).message) {
                if ((error as any).message.includes('Network Error')) {
                  errorMessage = 'Network error. Please check your connection.';
                } else if ((error as any).message.includes('timeout')) {
                  errorMessage = 'Request timed out. Please try again.';
                } else if ((error as any).status === 0) {
                  errorMessage = 'Unable to connect to the server. Please check your network connection.';
                } else if ((error as any).message.includes('No records exist')) {
                  errorMessage = 'No records exist for the selected date range';
                } else {
                  errorMessage = (error as any).message;
                }
              }
              
              this.toastService.show(errorMessage, 'error');
              this.loading = false;
            }
          });
      },
      error: (error) => {
        console.error('[DailyReportsComponent] Error checking data:', error);
        this.toastService.show('Error checking data: ' + (error.message || 'Unknown error'), 'error');
        this.loading = false;
      }
    });
  }
} 