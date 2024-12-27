import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  imageUrl: string;
}

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="container">
      <h2>Manage Products</h2>
      
      <!-- Add/Edit Product Form -->
      <div class="form-container">
        <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
        <form (ngSubmit)="saveProduct()">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" [(ngModel)]="currentProduct.name" name="name" required>
          </div>

          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" id="price" [(ngModel)]="currentProduct.price" name="price" required>
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <input type="number" id="stock" [(ngModel)]="currentProduct.stock" name="stock" required>
          </div>

          <div class="form-group">
            <label for="category">Category:</label>
            <select id="category" [(ngModel)]="currentProduct.category" name="category" required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Desserts">Desserts</option>
              <option value="Drink">Drink</option>
            </select>
          </div>

          <div class="form-group">
            <label for="imageFile">Image:</label>
            <input 
              type="file" 
              id="imageFile" 
              (change)="onFileSelected($event)" 
              accept="image/*"
              #fileInput
            >
            <img 
              *ngIf="currentProduct.imageUrl" 
              [src]="currentProduct.imageUrl.startsWith('http') ? currentProduct.imageUrl : 'http://localhost:5000' + currentProduct.imageUrl" 
              alt="Product preview" 
              style="max-width: 200px; margin-top: 10px; object-fit: cover;"
            >
          </div>

          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" [(ngModel)]="currentProduct.description" name="description"></textarea>
          </div>

          <button type="submit">{{ editingProduct ? 'Update' : 'Add' }} Product</button>
          <button type="button" *ngIf="editingProduct" (click)="cancelEdit()">Cancel</button>
        </form>
      </div>

      <!-- Products List -->
      <div class="products-list">
        <h3>Products List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{product.name}}</td>
              <td>{{product.price}}</td>
              <td>{{product.stock}}</td>
              <td>{{product.category}}</td>
              <td>
                <img 
                  [src]="product.imageUrl.startsWith('http') ? product.imageUrl : 'http://localhost:5000' + product.imageUrl" 
                  alt="{{product.name}}" 
                  style="width: 50px; height: 50px; object-fit: cover;"
                >
              </td>
              <td>
                <button (click)="editProduct(product)">Edit</button>
                <button (click)="deleteProduct(product._id, product.imageUrl)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .form-container {
      max-width: 500px;
      margin-bottom: 30px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, select, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    textarea {
      height: 100px;
      resize: vertical;
    }
    button {
      padding: 8px 15px;
      margin-right: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
    }
  `]
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = {
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    imageUrl: ''
  };
  editingProduct: boolean = false;
  private apiUrl = 'http://localhost:5000/api/admin';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Failed to load products');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProduct() {
    if (!this.selectedFile && !this.editingProduct) {
      alert('Please select an image file');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('http://localhost:5000/api/upload', formData).subscribe({
        next: (response: any) => {
          this.currentProduct.imageUrl = response.imageUrl;
          this.saveProductData();
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        }
      });
    } else {
      this.saveProductData();
    }
  }

  private saveProductData() {
    console.log('Saving product:', this.currentProduct);
    if (this.editingProduct) {
      this.http.put(`${this.apiUrl}/products/${this.currentProduct._id}`, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          alert('Product updated successfully');
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
        }
      });
    } else {
      this.http.post(`${this.apiUrl}/products`, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          alert('Product added successfully');
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Failed to add product');
        }
      });
    }
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.editingProduct = true;
  }

  deleteProduct(id: string | undefined, imageUrl: string) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:5000/api/products/${id}`).subscribe({
        next: () => {
          const filename = imageUrl.split('/').pop();
          if (filename) {
            this.http.delete(`http://localhost:5000/api/upload/${filename}`).subscribe({
              next: () => console.log('Image deleted successfully'),
              error: (error) => console.error('Error deleting image:', error)
            });
          }
          this.loadProducts();
          alert('Product deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.currentProduct = {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      imageUrl: ''
    };
    this.editingProduct = false;
  }
}
