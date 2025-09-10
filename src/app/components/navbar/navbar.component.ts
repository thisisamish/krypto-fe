import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // uses your isLoggedIn$

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(
    public readonly cart: CartService,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  goToProfile() {
    // if not logged in, send to login first
    this.auth.isLoggedIn$
      .subscribe((logged) => {
        this.router.navigate([logged ? '/profile' : '/login']);
      })
      .unsubscribe();
  }
}
