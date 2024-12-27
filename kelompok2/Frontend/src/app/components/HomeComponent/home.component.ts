import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../product-list/product-list.component';
import { OrderComponent } from '../OrderComponent/OrderComponent.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListComponent, OrderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cart: any[] = [];

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  handleOrderPlaced(orderData: any) {
    this.cart = [];
    localStorage.removeItem('cart');
  }
}