import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router'
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  termsAccepted = false;
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

register() {
  if (!this.termsAccepted) {
    this.message = "Veuillez accepter les termes et la politique.";
    return;
  }

  this.authService.register(this.name, this.email, this.password).subscribe({
    next: () => {
      this.message = "Inscription réussie, redirection...";
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: err => {
      console.error('Registration error:', err);
      this.message = err?.error?.message || "Erreur de connexion au serveur. Vérifiez que le serveur est en cours d'exécution.";
    }
  });
}
}