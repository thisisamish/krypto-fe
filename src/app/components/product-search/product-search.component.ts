import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  imports: [FormsModule],
  template: ` <div class="flex items-center gap-2">
    <div class="relative flex-1">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
      <input
        class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
        [value]="q()"
        (input)="onSearchInput($event)"
        placeholder="Search products..."
      />
    </div>
  </div>`,
})
export class ProductSearchComponent {
  readonly q = signal('');

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.q.set(input.value);
  }
}
