import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component'; // Ensure this path is correct
import { DashboardComponent } from '../dashboard/dashboard.component'; // Ensure this path is correct
import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
  
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private authService: AuthService) {} // Inject AuthService

  logout(): void {
    this.authService.logout();
  }
}