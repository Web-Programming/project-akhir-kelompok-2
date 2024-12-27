import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './RegistrationComponent.html',
  styleUrls: ['./RegistrationComponent.css']
})
export class RegistrationComponent {
  user: User = { name: '', email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Semua field harus diisi';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registrasi berhasil! Silakan login.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        this.errorMessage = error.error?.message || 'Registrasi gagal. Silakan coba lagi.';
      }
    });
  }
}
