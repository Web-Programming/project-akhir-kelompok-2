import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = '';
  quantities: { [key: string]: number } = {}; // Store quantities for each product

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products')
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products;
          // Initialize quantities for each product
          this.products.forEach(product => {
            this.quantities[product._id] = 1;
          });
          console.log('Products loaded:', products);
        },
        error: (error) => {
          console.error('Error loading products:', error);
        }
      });
  }

  filterProducts(category: string) {
    this.selectedCategory = category;
    if (category) {
      this.filteredProducts = this.products.filter(product => product.category === category);
    } else {
      this.filteredProducts = this.products;
    }
  }

  // Get quantity for a specific product
  getQuantity(product: any): number {
    return this.quantities[product._id] || 1;
  }

  // Increase quantity for a specific product
  increaseQuantity(product: any) {
    const currentQty = this.getQuantity(product);
    if (currentQty < product.stock) {
      this.quantities[product._id] = currentQty + 1;
    }
  }

  // Decrease quantity for a specific product
  decreaseQuantity(product: any) {
    const currentQty = this.getQuantity(product);
    if (currentQty > 1) {
      this.quantities[product._id] = currentQty - 1;
    }
  }

  addToCart(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const userId = localStorage.getItem('userId');
    // Get existing cart or initialize new one with user-specific key
    const existingCart = localStorage.getItem(`cart_${userId}`);
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item._id === product._id);
    const quantity = this.getQuantity(product);
    
    if (existingItem) {
      // If product exists and quantity is less than stock, update quantity
      if (existingItem.quantity + quantity <= product.stock) {
        existingItem.quantity += quantity;
        alert('Jumlah produk diperbarui di keranjang');
      } else {
        alert('Stok produk tidak mencukupi');
        return;
      }
    } else {
      // Add new product to cart
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        stock: product.stock,
        imageUrl: product.imageUrl
      });
      alert('Produk ditambahkan ke keranjang');
    }

    // Save cart with user-specific key
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    
    // Reset quantity after adding to cart
    this.quantities[product._id] = 1;
    
    // Trigger a custom event to notify OrderComponent
    window.dispatchEvent(new Event('cartUpdated'));
  }
}
