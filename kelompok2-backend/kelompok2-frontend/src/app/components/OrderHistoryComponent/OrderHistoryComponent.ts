import { Component } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  orders = [
    { id: 1, date: '2024-12-19', total: 250000 },
    { id: 2, date: '2024-12-20', total: 500000 },
  ];

  printOrder(order: any) {
    console.log('Cetak pesanan:', order);
  }
}
