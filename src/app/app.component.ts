import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './features/customer/pages/components/cart-drawer/cart-drawer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CartDrawerComponent,
  ],
  template: ` <div class="min-h-screen mx-8 md:mx-20 lg:mx-32 flex flex-col">
    <app-navbar></app-navbar>
    <app-cart-drawer></app-cart-drawer>
    <main class="grow">
      <router-outlet />
    </main>
    <app-footer></app-footer>
  </div>`,
})
export class AppComponent {
  title = 'krypto';
}
