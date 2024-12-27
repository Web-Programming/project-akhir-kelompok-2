import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageCustomersComponent } from './manage-customers/manage-customers.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'products', component: ManageProductsComponent },
  { path: 'orders', component: ManageOrdersComponent },
  { path: 'customers', component: ManageCustomersComponent },
  { path: 'payments', component: PaymentConfirmationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
