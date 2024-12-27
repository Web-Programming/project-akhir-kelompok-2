import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  // Add other payment properties as needed
}

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="payment-container">
      <h2>Payment Confirmations</h2>
      <table class="payment-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let payment of payments">
            <td>{{payment.orderId}}</td>
            <td>{{payment.amount}}</td>
            <td>{{payment.status}}</td>
            <td>
              <button (click)="confirmPayment(payment._id)">Confirm</button>
              <button (click)="rejectPayment(payment._id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .payment-container {
      padding: 20px;
    }
    .payment-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
    }
    button {
      margin-right: 8px;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:first-child {
      background-color: #28a745;
      color: white;
    }
    button:last-child {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class PaymentConfirmationComponent {
  payments: Payment[] = [];
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {
    this.loadPayments();
  }

  loadPayments() {
    this.http.get<Payment[]>(`${this.apiUrl}/payments`).subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        alert('Failed to load payments');
      }
    });
  }

  confirmPayment(paymentId: string) {
    this.http.patch(`${this.apiUrl}/payments/${paymentId}`, { status: 'confirmed' }).subscribe({
      next: () => {
        this.loadPayments();
        alert('Payment confirmed successfully');
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        alert('Failed to confirm payment');
      }
    });
  }

  rejectPayment(paymentId: string) {
    this.http.patch(`${this.apiUrl}/payments/${paymentId}`, { status: 'rejected' }).subscribe({
      next: () => {
        this.loadPayments();
        alert('Payment rejected successfully');
      },
      error: (error) => {
        console.error('Error rejecting payment:', error);
        alert('Failed to reject payment');
      }
    });
  }
}
