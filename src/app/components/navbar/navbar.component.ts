import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service'; // adjust path

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  // Expose service to the template so we can call totalCount()
  constructor(public readonly cart: CartService) {}
}
