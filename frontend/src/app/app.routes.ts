import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HotelListComponent } from './pages/hotel/hotel-list/hotel-list.component';
import { HotelFormComponent } from './pages/hotel/hotel-form/hotel-form.component';
import { AuthGuard } from './guards/auth.guards';

import { MainLayoutComponent } from './pages/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password/:token', component: LoginComponent },
  
  // Zone authentifiée
  { 
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'hotels', component: HotelListComponent },
      { path: 'hotels/new', component: HotelFormComponent },
      { path: '**', redirectTo: 'dashboard' } // Fallback pour les 404 internes
    ]
  }
];