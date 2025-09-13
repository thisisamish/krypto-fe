import { Component, inject } from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ProductSearchComponent],
  template: `
    <app-product-search></app-product-search>

    @if (user(); as u && u.firstName) {
    <h1 class="py-6 text-3xl font-semibold">Hello, {{ u.firstName }}!</h1>
    } @else {
    <h1 class="py-6 text-3xl font-semibold">Hello!</h1>
    }
  `,
})
export class HeaderComponent {
  private auth = inject(AuthService);

  user = toSignal(this.auth.user$, { initialValue: null });
}
