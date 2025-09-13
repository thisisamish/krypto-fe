import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-grid',
  // No need for standalone: true if it's declared in a module
  imports: [ProductCardComponent, CommonModule],
  template: `
    <!-- Product Grid -->
    <div
      class="grid gap-x-2 gap-y-6 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]"
    >
      <app-product-card
        *ngFor="let item of products"
        [item]="item"
      ></app-product-card>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center gap-4 mt-8">
      <button
        (click)="previousPage()"
        [disabled]="currentPage === 0"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-lg font-medium">
        Page {{ currentPage + 1 }} of {{ totalPages }}
      </span>
      <button
        (click)="nextPage()"
        [disabled]="currentPage >= totalPages - 1"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  `,
})
export class ProductGridComponent implements OnInit {
  products: Product[] = [];
  currentPage = 0;
  pageSize = 20; // Or whatever size you prefer
  totalPages = 0;
  totalElements = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.content; // Correctly assign the array from the 'content' property
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        // The API returns 0-indexed page number, which matches our currentPage
        this.currentPage = res.number;
        console.log('Data from API:', res);
      },
      error: (err) => console.error('There was an error: ', err),
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
