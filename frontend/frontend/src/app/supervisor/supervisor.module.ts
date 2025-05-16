import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorRoutingModule } from './supervisor-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewClientsComponent } from './view-clients/view-clients.component';
import { OrdersComponent } from './orders/orders.component';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';

@NgModule({
  imports: [
    CommonModule,
    SupervisorRoutingModule,
    FormsModule,
    HttpClientModule,
    ViewClientsComponent,
    OrdersComponent,
    DailyReportsComponent
  ]
})
export class SupervisorModule { } 