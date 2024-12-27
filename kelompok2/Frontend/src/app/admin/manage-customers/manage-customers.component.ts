import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-customers',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.css']
})
export class ManageCustomersComponent implements OnInit {
  customers: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe({
      next: (data) => {
        console.log('Customers loaded:', data);
        this.customers = data;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        alert('Error loading customers');
      }
    });
  }

  deleteCustomer(customerId: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.http.delete(`http://localhost:5000/api/users/${customerId}`).subscribe({
        next: () => {
          console.log('Customer deleted successfully');
          this.loadCustomers(); // Refresh the list
          alert('Customer deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('Error deleting customer');
        }
      });
    }
  }
}
