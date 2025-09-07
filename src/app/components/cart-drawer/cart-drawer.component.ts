import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SidebarModule } from 'primeng/sidebar';
import { CartService } from '../../services/cart.service'; // adjust path
import { QtyStepperComponent } from '../qty-stepper/qty-stepper.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputNumberModule,
    SidebarModule,
    QtyStepperComponent,
  ],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.css'],
})
export class CartDrawerComponent {
  constructor(public readonly cart: CartService) {}

  updateQty(id: string, qty: number) {
    this.cart.setQuantity(id, qty);
  }
}
