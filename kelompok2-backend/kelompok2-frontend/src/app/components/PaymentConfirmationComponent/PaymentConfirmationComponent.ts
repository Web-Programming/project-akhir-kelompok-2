import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent {
  uploadFile(event: any) {
    const file = event.target.files[0];
    console.log('Bukti pembayaran:', file);
  }

  confirmPayment() {
    console.log('Pembayaran dikonfirmasi.');
  }
}
