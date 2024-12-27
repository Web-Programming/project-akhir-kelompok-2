import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface OrderForm {
  address: string;
  phone: string;
  paymentMethod: 'transfer' | 'OVO' | 'GoPay';
  ewalletNumber?: string;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './OrderComponent.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  cart: any[] = [];
  orderPlaced: boolean = false;
  private cartUpdateListener: any;
  customerName: string = '';

  order: OrderForm = {
    address: '',
    phone: '',
    paymentMethod: 'transfer',
    ewalletNumber: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadCustomerName();
    
    // Listen for cart updates
    this.cartUpdateListener = () => this.loadCart();
    window.addEventListener('cartUpdated', this.cartUpdateListener);
  }

  loadCustomerName() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get(`http://localhost:5000/api/users/${userId}`).subscribe({
        next: (response: any) => {
          this.customerName = response.name;
        },
        error: (error) => {
          console.error('Error loading customer name:', error);
        }
      });
    }
  }

  ngOnDestroy() {
    // Clean up the event listener
    window.removeEventListener('cartUpdated', this.cartUpdateListener);
  }

  loadCart() {
    const userId = localStorage.getItem('userId');
    const savedCart = localStorage.getItem(`cart_${userId}`);
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  removeFromCart(item: any) {
    const userId = localStorage.getItem('userId');
    this.cart = this.cart.filter(cartItem => cartItem._id !== item._id);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(this.cart));
    
    if (this.cart.length === 0) {
      this.router.navigate(['/']);
    }
  }

  updateQuantity(item: any, change: number) {
    const userId = localStorage.getItem('userId');
    const cartItem = this.cart.find(i => i._id === item._id);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity > 0 && newQuantity <= cartItem.stock) {
        cartItem.quantity = newQuantity;
        localStorage.setItem(`cart_${userId}`, JSON.stringify(this.cart));
      }
    }
  }

  getTotalPrice(): number {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  placeOrder() {
    if (!this.order.address?.trim() || !this.order.phone?.trim()) {
      alert('Mohon lengkapi alamat dan nomor telepon');
      return;
    }

    if ((this.order.paymentMethod === 'OVO' || this.order.paymentMethod === 'GoPay') && !this.order.ewalletNumber?.trim()) {
      alert(`Mohon lengkapi nomor ${this.order.paymentMethod.toUpperCase()}`);
      return;
    }

    const userId = localStorage.getItem('userId');
    console.log('Current userId:', userId);

    if (!userId) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    const orderData = {
      userId: userId,
      
      items: this.cart.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        stock: item.quantity
      })),
      total: this.getTotalPrice(),
      address: this.order.address.trim(),
      phone: this.order.phone.trim(),
      paymentMethod: this.order.paymentMethod,
      ewalletNumber: this.order.ewalletNumber?.trim(),
      status: 'pending'
    };

    console.log('Sending order data:', orderData);

    // First update the product stock
    const updateStockPromises = this.cart.map(item => {
      const productId = item._id || item.id;
      console.log('Updating stock for product:', { productId, item });
      
      if (!productId) {
        console.error('No product ID found for item:', item);
        throw new Error('Product ID is missing');
      }

      return this.http.put(`http://localhost:5000/api/products/${productId}/update-stock`, {
        quantity: item.quantity
      }).toPromise();
    });

    // Execute all stock updates first
    Promise.all(updateStockPromises)
      .then(() => {
        // If all stock updates successful, create the order
        this.http.post('http://localhost:5000/api/orders/create', orderData)
          .subscribe({
            next: (response: any) => {
              console.log('Order created:', response);
              const userId = localStorage.getItem('userId');
              
              // Clear the user-specific cart
              localStorage.removeItem(`cart_${userId}`);
              this.cart = [];
              
              // Save order details for payment confirmation
              localStorage.setItem('pendingOrder', JSON.stringify({
                ...orderData,
                id: response._id
              }));
              
              // Navigate to payment confirmation
              this.router.navigate(['/payment-confirmation']);
            },
            error: (error) => {
              console.error('Error creating order:', error);
              alert('Gagal membuat pesanan. Silakan coba lagi.');
            }
          });
      })
      .catch(error => {
        console.error('Error updating stock:', error);
        alert('Gagal memperbarui stok. Silakan coba lagi.');
      });
  }

  orderAgain() {
    this.orderPlaced = false;
    this.order = {
      address: '',
      phone: '',
      paymentMethod: 'transfer',
      ewalletNumber: ''
    };
  }
}