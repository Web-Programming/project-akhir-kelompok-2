import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.css']
})
export class FilterProductsComponent {
  categories = ['Elektronik', 'Pakaian', 'Makanan'];
  products = [
    { id: 1, name: 'Produk A', price: 100000, category: 'Elektronik' },
    { id: 2, name: 'Produk B', price: 150000, category: 'Pakaian' },
  ];
  filteredProducts = this.products;

  filterByCategory(category: string) {
    this.filteredProducts = category
      ? this.products.filter((product) => product.category === category)
      : this.products;
  }
}
