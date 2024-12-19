import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [
    { id: 1, name: 'Produk A', price: 100000, image: 'link-gambar-a' },
    { id: 2, name: 'Produk B', price: 150000, image: 'link-gambar-b' },
  ];

  addToCart(product: any) {
    console.log('Menambahkan ke keranjang:', product.name);
  }

  viewDetails(productId: number) {
    console.log('Lihat detail produk ID:', productId);
  }
}
