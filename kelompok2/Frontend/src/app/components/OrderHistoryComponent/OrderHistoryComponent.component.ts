import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './OrderHistoryComponent.component.html',
  styleUrls: ['./OrderHistoryComponent.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    this.http.get<any[]>(`http://localhost:5000/api/orders/user/${userId}`).subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        console.log('Orders loaded:', this.orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        alert('Error loading orders');
      }
    });
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Diproses';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  }

  payOrder(orderId: string) {
    // Store the order ID in localStorage
    localStorage.setItem('pendingOrder', JSON.stringify({
      id: orderId
    }));
    
    // Navigate to payment confirmation page
    this.router.navigate(['/payment-confirmation']);
  }

  cancelOrder(orderId: string) {
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      this.http.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}).subscribe({
        next: (response) => {
          console.log('Order cancelled:', response);
          this.loadOrders(); // Reload orders to show updated status
          alert('Pesanan berhasil dibatalkan');
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Gagal membatalkan pesanan');
        }
      });
    }
  }
}
