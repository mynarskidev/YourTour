import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BasketComponent } from './basket/basket.component';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from '../services/auth.guard';
import { AdminAuthGuard } from './../services/adminAuth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminAuthGuard] },
  { path: 'edit-trip/:id', component: EditTripComponent, canActivate: [AdminAuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
