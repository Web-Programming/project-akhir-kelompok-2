import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterProductsComponent } from './components/filter-products/filter-products.component';
import { OrderComponent } from './components/OrderComponent/OrderComponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FilterProductsComponent, OrderComponent],
  template: `
    <app-filter-products (addToCart)="handleAddToCart($event)"></app-filter-products>
    <app-order [cart]="cart"></app-order>
  `
})
export class AppComponent {
  cart: any[] = [];

  handleAddToCart(product: any) {
    this.cart.push(product);
    console.log('Produk ditambahkan ke keranjang:', product);
  }
}
