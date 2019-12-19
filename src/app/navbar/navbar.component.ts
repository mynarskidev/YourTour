import { ProductsService } from 'src/services/product.service';
import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { BasketService } from 'src/services/basketService';
import { AuthService } from '../../services/auth.service';
import get from 'lodash/get';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  fasten: boolean;
  productsCount = 0;
  productsSum = 0;
  adminRole = false;
  constructor(private authService: AuthService, private router: Router, private productService: ProductsService, private basket: BasketService, private fireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.basket.getProductsCountObservable().subscribe(productsCount => {
      this.productsCount = productsCount;
    });
    this.basket.getProductsSumObservable().subscribe(productsSum => {
      this.productsSum = productsSum;
    });
    this.checkUser();
  }

  openBasket() {
    this.router.navigate(['/basket']);
  }

  openOrders() {
    this.router.navigate(['/orders']);
  }

  getUser() {
    return this.authService.getUser();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
      this.productsCount = 0;
      this.productsSum = 0;
      this.adminRole = false;
    });
    if (!(window.location.href.indexOf("login") > -1))
      this.router.navigate(['/login']);
  }

  checkUser() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.productService.getUserRole(user.email).subscribe(roles => {
          this.adminRole = (get(roles, '[0].role') === 'admin');
        });
      }
    });
  }

  @HostListener('window:scroll', []) onWindowScroll() {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    this.fasten = verticalOffset > 30;
  }
}
