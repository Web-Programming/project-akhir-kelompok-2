import { Component } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  cart = [{ name: 'Produk A', price: 100000 }, { name: 'Produk B', price: 150000 }];
  order = { address: '' };

  placeOrder() {
    console.log('Pesanan berhasil:', this.order);
  }
}
