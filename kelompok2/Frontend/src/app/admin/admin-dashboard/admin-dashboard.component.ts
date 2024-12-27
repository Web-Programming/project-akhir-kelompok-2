import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  totalRevenue: number = 0;
  completedOrders: number = 0;
  revenueData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Get total products
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        console.log('Total products:', this.totalProducts);
      },
      error: (error) => console.error('Error loading products:', error)
    });

    // Get total orders
    this.http.get<any[]>('http://localhost:5000/api/orders').subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        
        // Filter completed orders and prepare revenue data
        const completedOrders = orders.filter(order => order.status === 'completed');
        this.completedOrders = completedOrders.length;
        this.totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
        
        // Prepare revenue data for table
        this.revenueData = completedOrders.map(order => ({
          date: new Date(order.date).toLocaleDateString('id-ID'),
          orderId: order._id,
          items: order.items.map((item: any) => `${item.name} (${item.quantity})`).join(', '),
          total: order.total
        }));

        console.log('Revenue data:', this.revenueData);
      },
      error: (error) => console.error('Error loading orders:', error)
    });

    // Get total customers
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
        console.log('Total customers:', this.totalCustomers);
      },
      error: (error) => console.error('Error loading customers:', error)
    });
  }

  printReport() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate the report HTML
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Revenue Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .header { text-align: center; margin-bottom: 20px; }
          .total { font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Laporan Pendapatan</h2>
          <p>Generated on: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Order ID</th>
              
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${this.revenueData.map(row => `
              <tr>
                <td>${row.date}</td>
                <td>${row.orderId}</td>
                
                <td>${row.items}</td>
                <td>Rp${row.total.toLocaleString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Total Pendapatan: Rp${this.totalRevenue.toLocaleString('id-ID')}</p>
          <p>Total Completed Orders: ${this.completedOrders}</p>
        </div>
      </body>
      </html>
    `;

    // Write the content and print
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  }
}
