import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './LoginComponent.component.html',
  styleUrls: ['./LoginComponent.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  login() {
    const loginData = {
      email: this.user.email,
      password: this.user.password
    };

    this.http.post('http://localhost:5000/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          
          // Store all necessary information
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('isAdmin', response.isAdmin);
          
          console.log('Stored userId:', localStorage.getItem('userId'));
          console.log('Is admin:', localStorage.getItem('isAdmin'));
          
          // Redirect based on user type
          if (response.isAdmin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
  }
}
