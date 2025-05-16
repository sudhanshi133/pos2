import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewClientsComponent } from './view-clients/view-clients.component';
import { ViewProductsComponent } from './view-products/view-products.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { ReportsComponent } from './reports/reports.component';
import { UploadProductsComponent } from './upload-products/upload-products.component';
import { UploadInventoryComponent } from './upload-inventory/upload-inventory.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ViewClientsComponent },
  { path: 'products', component: ViewProductsComponent },
  { path: 'orders', component: ViewOrdersComponent },
  { path: 'upload-data', component: UploadDataComponent },
  { path: 'upload-products', component: UploadProductsComponent },
  { path: 'upload-inventory', component: UploadInventoryComponent },
  { path: 'analytics', component: ReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRoutingModule { } 