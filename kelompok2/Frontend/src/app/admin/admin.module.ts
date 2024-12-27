// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

// Import components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageCustomersComponent } from './manage-customers/manage-customers.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    // Import standalone components here instead of declaring them
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    ManageCustomersComponent,
    PaymentConfirmationComponent
  ]
})
export class AdminModule { }
