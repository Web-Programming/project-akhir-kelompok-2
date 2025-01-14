import { NgModule } from '@angular/core'; // Import ini penting untuk mendeklarasikan modul
import { RouterModule, Routes } from '@angular/router'; // RouterModule digunakan untuk routing di Angular
import { ProductListComponent } from './components/product-list/product-list.component';
import { FilterProductsComponent } from './components/filter-products/filter-products.component';
import { RegistrationComponent } from './components/RegistrationComponent/RegistrationComponent'; // Sesuai dengan import Anda
import { OrderHistoryComponent } from './components/OrderHistoryComponent/OrderHistoryComponent.component'; // Sesuai dengan import Anda
import { PaymentConfirmationComponent } from './components/PaymentConfirmationComponent/PaymentConfirmationComponent.component'; // Sesuai dengan import Anda
import { OrderComponent } from './components/OrderComponent/OrderComponent.component'; // Sesuai dengan import Anda
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/LoginComponent/LoginComponent.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
// Konfigurasi routing
const routes: Routes = [
  { path: '', component: ProductListComponent }, // Halaman utama
  // { path: '', component: LoginComponent }, // Halaman utama
  { path: 'filter-products', component: FilterProductsComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'order', component: OrderComponent },
  // { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'payment-confirmation', component: PaymentConfirmationComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],  // Hanya bisa diakses jika sudah login
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)], // Pastikan RouterModule diimport dengan benar
  exports: [RouterModule], // Ekspor RouterModule agar bisa digunakan di app.module.ts
})
export class AppRoutingModule {} // Deklarasi modul routing
