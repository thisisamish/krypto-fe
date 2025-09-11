import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, ProductGridComponent],
  template: `
    <app-header></app-header>
    <app-product-grid></app-product-grid>
  `,
})
export class HomePageComponent {}
