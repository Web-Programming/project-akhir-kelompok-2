import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './OrderComponent.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  @Input() cart: any[] = [];
  order = { address: '' };

  // Fungsi untuk menghitung total harga
  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  placeOrder() {
    if (this.cart.length === 0) {
      alert('Keranjang belanja Anda kosong!');
      return;
    }

    console.log('Pesanan berhasil:', this.cart, this.order);
    alert(`Pesanan Anda berhasil! Total harga: Rp${this.getTotalPrice().toLocaleString('id-ID')}`);
    this.cart = []; // Kosongkan keranjang setelah pemesanan
  }
}
