import { Component } from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-header',
  imports: [ProductSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
