import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user = { name: '', email: '', password: '' };

  register() {
    console.log('Registrasi berhasil:', this.user);
  }
}
