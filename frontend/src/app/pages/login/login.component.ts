import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  view: 'login' | 'forgot' | 'reset' = 'login';
  email = '';
  password = '';
  confirm = '';
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) this.view = 'reset';
    else if (this.router.url.includes('forgot')) this.view = 'forgot';
  }

  goTo(v: 'login' | 'forgot') {
    this.view = v;
    this.message = '';
    this.password = this.confirm = '';
  }

  login(event: Event) {
  event.preventDefault();
  console.log("Tentative de connexion avec:", this.email);

  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log("Réponse du backend:", res);
      this.message = "Connexion réussie !";
      setTimeout(() => this.router.navigate(['/dashboard']), 1500);
    },
    error: (err) => {
      console.error("Erreur:", err);
      this.message = err.error?.message || "Identifiants incorrects";
    }
  });
}
  sendResetLink() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => this.message = 'Lien envoyé à votre email',
      error: () => this.message = 'Email introuvable'
    });
  }

  resetPassword() {
    if (this.password !== this.confirm) {
      this.message = 'Les mots de passe ne correspondent pas';
      return;
    }

    const token = this.route.snapshot.paramMap.get('token');
console.log('Token reçu:', token);
    if (!token) return;

    this.authService.resetPassword(token, this.password).subscribe({
      next: () => {
        this.message = 'Mot de passe mis à jour';
        setTimeout(() => this.goTo('login'), 2000);
      },
      error: () => this.message = 'Lien invalide ou expiré'
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}