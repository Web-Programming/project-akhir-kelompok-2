import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface OrderDetails {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  address: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './PaymentConfirmationComponent.component.html',
  styleUrls: ['./PaymentConfirmationComponent.component.css']
})
export class PaymentConfirmationComponent implements OnInit {
  orderDetails: OrderDetails | null = null;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const orderData = localStorage.getItem('pendingOrder');
    if (orderData) {
      this.orderDetails = JSON.parse(orderData);
      console.log('Loaded order details:', this.orderDetails);
    } else {
      console.log('No order details found in localStorage');
      this.router.navigate(['/']);
    }
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  confirmPayment() {
    if (!this.selectedFile) {
      alert('Silakan pilih file bukti pembayaran');
      return;
    }

    if (!this.orderDetails || !this.orderDetails.id) {
      alert('Data pesanan tidak ditemukan');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('paymentProof', this.selectedFile);

    // Update order status to paid
    this.http.put(`http://localhost:5000/api/orders/${this.orderDetails.id}/confirm-payment`, formData)
      .subscribe({
        next: (response: any) => {
          console.log('Payment confirmed:', response);
          alert('Pembayaran berhasil dikonfirmasi!');
          localStorage.removeItem('pendingOrder');
          this.router.navigate(['/order-history']);
        },
        error: (error) => {
          console.error('Error confirming payment:', error);
          alert('Terjadi kesalahan saat konfirmasi pembayaran');
        }
      });
  }
}