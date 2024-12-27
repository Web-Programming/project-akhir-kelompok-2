import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Diproses';
      default:
        return status;
    }
  }

  loadOrders() {
    this.http.get<any[]>('http://localhost:5000/api/orders').subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  updateOrderStatus(orderId: string) {
    this.http.put(`http://localhost:5000/api/orders/${orderId}`, {
      status: 'completed'
    }).subscribe({
      next: (response) => {
        console.log('Order status updated:', response);
        this.loadOrders();
        alert('Status pesanan berhasil diperbarui!');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Gagal memperbarui status pesanan. Error: ' + error.message);
      }
    });
  }
}
