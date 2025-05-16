import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RevenueService, RevenueListData, SalesReportFilterForm } from '../../services/revenue.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="sales-summary-container">
      <h2>Sales Summary</h2>
      
      <div class="filter-section">
        <div class="filter-group">
          <label for="startDate">Start Date</label>
          <input type="date" id="startDate" [(ngModel)]="filterForm.startDate">
        </div>
        
        <div class="filter-group">
          <label for="endDate">End Date</label>
          <input type="date" id="endDate" [(ngModel)]="filterForm.endDate">
        </div>
        
        <div class="filter-group">
          <label for="clientName">Client Name</label>
          <input type="text" id="clientName" [(ngModel)]="filterForm.clientName" placeholder="Filter by client name">
        </div>

        <div class="button-group">
          <button class="search-button" (click)="onSearch()">
            <i class="bi bi-search"></i>
            Search
          </button>
          <button class="download-button" (click)="downloadReport()" [disabled]="!revenueData?.list?.length">
            <i class="bi bi-download"></i>
            Download
          </button>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <h3>Total Revenue</h3>
          <div class="value">₹{{ totalRevenue | number:'1.2-2' }}</div>
        </div>

        <div class="summary-card">
          <h3>Total Quantity Sold</h3>
          <div class="value">{{ totalQuantity }}</div>
        </div>

        <div class="summary-card">
          <h3>Total Products</h3>
          <div class="value">{{ revenueData?.list?.length || 0 }}</div>
        </div>

        <div class="summary-card">
          <h3>Average Revenue per Product</h3>
          <div class="value">₹{{ averageRevenue | number:'1.2-2' }}</div>
        </div>
      </div>

      <div class="revenue-table">
        <h3>Detailed Sales Report</h3>
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Product Name</th>
              <th>Barcode</th>
              <th>Total Quantity</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of revenueData?.list || []">
              <td>{{ item.clientName }}</td>
              <td>{{ item.productName }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.totalQuantity }}</td>
              <td>₹{{ item.totalRevenue | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .sales-summary-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    h2 {
      color: #1a237e;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }

    .filter-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      align-items: flex-end;
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      color: #666;
      font-size: 0.9rem;
    }

    .filter-group input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-button, .download-button {
      background: #1a237e;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 38px;
      transition: all 0.3s ease;
    }

    .download-button {
      background: #4CAF50;
    }

    .search-button:hover {
      background: #151b60;
      transform: translateY(-1px);
    }

    .download-button:hover:not(:disabled) {
      background: #388e3c;
      transform: translateY(-1px);
    }

    .download-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .search-button i, .download-button i {
      font-size: 1.1rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .summary-card h3 {
      color: #666;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #1a237e;
    }

    .revenue-table {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .revenue-table h3 {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    tr:hover {
      background: #f9f9f9;
    }

    @media (max-width: 768px) {
      .sales-summary-container {
        padding: 1rem;
      }

      .filter-section {
        flex-direction: column;
      }

      .filter-group {
        width: 100%;
      }

      .button-group {
        width: 100%;
        flex-direction: column;
      }

      .search-button, .download-button {
        width: 100%;
        justify-content: center;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class SalesSummaryComponent implements OnInit {
  revenueData: RevenueListData | null = null;
  filterForm: SalesReportFilterForm = {
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    clientName: ''
  };

  constructor(
    private revenueService: RevenueService,
    private toastService: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  onSearch() {
    this.loadFilteredData();
  }

  downloadReport() {
    if (!this.revenueData?.list?.length) {
      this.toastService.show('No data to download', 'info');
      return;
    }

    // Prepare the request payload
    const payload = {
      startDate: this.filterForm.startDate,
      endDate: this.filterForm.endDate,
      clientName: this.filterForm.clientName || '',
      data: this.revenueData.list,
      summary: {
        totalQuantity: this.totalQuantity,
        totalRevenue: this.totalRevenue,
        averageRevenue: this.averageRevenue
      }
    };

    // Make request to PDF generation endpoint
    this.http.post('http://localhost:8080/api/report/sales', payload, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    }).subscribe({
      next: (blob: Blob) => {
        // Create and download the PDF file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales_report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        this.toastService.show('Failed to download report: ' + (error.error?.message || error.message), 'error');
      }
    });
  }

  private loadInitialData() {
    console.log('Loading initial revenue data');
    this.revenueService.getMonthlyProductRevenue().subscribe({
      next: (data) => {
        console.log('Received initial revenue data:', data);
        this.revenueData = data;
        if (!data.list || data.list.length === 0) {
          this.toastService.show('No data found', 'info');
        }
      },
      error: (error) => {
        console.error('Error loading initial revenue data:', error);
        this.toastService.show('Failed to load revenue data: ' + (error.error?.message || error.message), 'error');
      }
    });
  }

  private loadFilteredData() {
    console.log('Loading filtered revenue data with filter:', this.filterForm);
    this.revenueService.getFilteredSalesReport(this.filterForm).subscribe({
      next: (data) => {
        console.log('Received filtered revenue data:', data);
        this.revenueData = data;
        if (!data.list || data.list.length === 0) {
          this.toastService.show('No data found for the selected filters', 'info');
        }
      },
      error: (error) => {
        console.error('Error loading filtered revenue data:', error);
        this.toastService.show('Failed to load filtered data: ' + (error.error?.message || error.message), 'error');
      }
    });
  }

  get totalRevenue(): number {
    const total = this.revenueData?.list?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0;
    console.log('Calculated total revenue:', total);
    return total;
  }

  get totalQuantity(): number {
    const total = this.revenueData?.list?.reduce((sum, item) => sum + item.totalQuantity, 0) || 0;
    console.log('Calculated total quantity:', total);
    return total;
  }

  get averageRevenue(): number {
    if (!this.revenueData?.list?.length) return 0;
    const avg = this.totalRevenue / this.revenueData.list.length;
    console.log('Calculated average revenue:', avg);
    return avg;
  }
} 