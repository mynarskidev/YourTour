import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from "../../services/product.service";
import { Product } from "../../models/product.model";
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private productService: ProductsService,
  ) {
  }

  trips = [];

  ngOnInit() {
    this.productService.fetchTrips().subscribe((products: Product[]) => {
      this.trips = products;
    });
  }

  removeTrip(trip: any) {
    this.productService.deleteProduct(trip.id);
  }
}
