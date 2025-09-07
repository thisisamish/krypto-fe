import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartDrawerComponent } from '../../components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HeaderComponent,
    ProductGridComponent,
    NavbarComponent,
    FooterComponent,
    CartDrawerComponent,
  ],
  template: `
    <div class="min-h-screen mx-8 md:mx-20 lg:mx-32 flex flex-col">
      <app-navbar></app-navbar>
      <app-cart-drawer></app-cart-drawer>
      <main class="grow">
        <app-header></app-header>
        <app-product-grid></app-product-grid>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class HomePageComponent {}
