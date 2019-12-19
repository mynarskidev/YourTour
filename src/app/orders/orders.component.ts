import { ProductsService } from 'src/services/product.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private productsService: ProductsService,
    private router: Router,
  ) {
  }

  orders = [];
  filteredOrders = [];

  ngOnInit() {
    this.productsService.fetchOrders().subscribe((orders) => {
      this.orders = orders;
      this.getFilteredOrders();
    });
  }

  backToHomePage() {
    this.router.navigate(['']);
  }

  getFilteredOrders() {
    this.filteredOrders = this.orders.filter((order) => {
      return ("owner" in order) && order.owner == this.authService.getUser();
    });
  }

  getTotal(trips) {
    let sum = 0;
    for (const trip of trips) {
      sum += trip.price * trip.reserved;
    }
    return sum;
  }
}
