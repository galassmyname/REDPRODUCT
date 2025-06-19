import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and other directives

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Removed the trailing comma here
})
export class DashboardComponent {
  dashboardCards = [
    { number: '125', title: 'Formulaires', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-form' },
    { number: '40', title: 'Messages', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-messages' },
    { number: '600', title: 'Utilisateurs', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-users' },
    { number: '25', title: 'E-mails', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-emails' },
    { number: '40', title: 'Hôtels', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-hotels' },
    { number: '02', title: 'Entités', subtitle: 'Je ne sais pas quoi mettre', iconClass: 'icon-entities' },
  ];
}