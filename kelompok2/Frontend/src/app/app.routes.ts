import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './components/OrderHistoryComponent/OrderHistoryComponent.component';
import { PaymentConfirmationComponent } from './components/PaymentConfirmationComponent/PaymentConfirmationComponent.component';
import { HomeComponent } from './components/HomeComponent/home.component';
import { LoginComponent } from './components/LoginComponent/LoginComponent.component';
import { RegistrationComponent } from './components/RegistrationComponent/RegistrationComponent';
import { OrderComponent } from './components/OrderComponent/OrderComponent.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent
      },
      {
        path: 'payment-confirmation',
        component: PaymentConfirmationComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
