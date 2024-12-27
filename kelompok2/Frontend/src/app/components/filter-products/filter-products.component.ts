import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <button class="btn btn-outline-primary mx-2" 
                    (click)="selectCategory('')"
                    [class.active]="selectedCategory === ''">
              All
            </button>
          </li>
          <li class="nav-item" *ngFor="let category of categories">
            <button class="btn btn-outline-primary mx-2"
                    (click)="selectCategory(category)"
                    [class.active]="selectedCategory === category">
              {{category}}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./filter-products.component.css']
})
export class FilterProductsComponent {
  @Output() categorySelected = new EventEmitter<string>();
  selectedCategory: string = '';

  categories = ['Breakfast', 'Lunch', 'Desserts', 'Drink'];

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
    console.log('Category selected:', category);
  }
}
