import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.css']

})
export class FilterProductsComponent {
  @Output() addToCart = new EventEmitter<any>();

  categories = ['Elektronik', 'Pakaian', 'Makanan'];
  products = [
    { id: 1, name: 'Smartphone', price: 3000000, category: 'Elektronik', stock: 5 },
    { id: 2, name: 'Laptop', price: 7000000, category: 'Elektronik', stock: 2 },
    { id: 3, name: 'Kaos Polos', price: 50000, category: 'Pakaian', stock: 10 }
  ];
  filteredProducts = this.products;

  filterByCategory(event: Event) {
    const target = event.target as HTMLSelectElement; // Casting Event ke HTMLSelectElement
    const selectedValue = target.value; // Ambil nilai dari elemen select
    this.filteredProducts = selectedValue
      ? this.products.filter((product) => product.category === selectedValue)
      : this.products;
  }
  

  addProductToCart(product: any) {
    if (product.stock > 0) {
      this.addToCart.emit(product);
      product.stock--; // Kurangi stok produk setelah ditambahkan ke keranjang
      alert(`${product.name} berhasil ditambahkan ke keranjang!`);
    } else {
      alert(`${product.name} sudah habis stok.`);
    }
  }
}
