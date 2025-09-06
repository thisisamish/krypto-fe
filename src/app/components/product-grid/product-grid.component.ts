import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css',
})
export class ProductGridComponent implements OnInit {
  data: any[] = [];
  temp: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('DUMMY_DATA.json').subscribe({
      next: (res) => (this.data = res),
      error: (err) => console.error('Error loading JSON', err),
    });

    this.http.get<any[]>('http://localhost:8080/api/v1/products').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error('There was an error: ', err),
    });
  }
}
