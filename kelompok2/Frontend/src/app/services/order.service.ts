import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../components/types/product.type';

export interface OrderHistory {
  id: number;
  date: string;
  items: Product[];
  total: number;
  customerDetails: {
    address: string;
    phone: string;
    paymentMethod: string;
  };
  paymentStatus: 'pending' | 'confirmed';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders'; // Update with your backend URL
  private currentOrder: OrderHistory | null = null;

  constructor(private http: HttpClient) {}

  setCurrentOrder(items: Product[], customerDetails: any) {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.currentOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...items],
      total: total,
      customerDetails: customerDetails,
      paymentStatus: 'pending'
    };
    return this.http.post<OrderHistory>(this.apiUrl, this.currentOrder);
  }

  confirmOrder(orderId: number) {
    return this.http.patch<OrderHistory>(`${this.apiUrl}/${orderId}/confirm-payment`, {});
  }

  getOrders(): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(this.apiUrl);
  }
}