import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/services/basketService';
import { Product } from 'src/models/product.model';
import { Router } from '@angular/router';
import { ProductsTableDS } from '../products/products-table-datasource';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  totalSum: number = 0;
  totalCount: number = 0;

  displayedColumns = ['name', 'price', 'count', 'amount', 'add', 'remove', 'delete'];
  displayedColumnsFooter = ['name', 'price', 'count', 'amount'];
  dataSource: ProductsTableDS

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private router: Router, private basketService: BasketService) {
  }

  ngOnInit() {
    this.dataSource = new ProductsTableDS([], null, null);
    this.basketService.getbasketProductsObservable().subscribe(basketProducts => {
      this.dataSource.data = basketProducts
    });
    this.basketService.getProductsSumObservable().subscribe(basketSum => {
      this.totalSum = basketSum;
    });
    this.basketService.getProductsCountObservable().subscribe(basketCount => {
      this.totalCount = basketCount;
    });
  }

  addOneToBasket(product: Product) {
    this.basketService.addOneFromBasket(product);
  }

  removeOneFromBasket(product: Product) {
    this.basketService.removeOneFromBasket(product);
  }

  disableButton(product: Product) {
    return product.reserved < 2 ? true : false
  }

  deleteFromBasket(product: Product) {
    this.basketService.deleteFormBasket(product);
  }

  backToHomePage() {
    this.router.navigate(['']);
  }

  makeOrder() {
    this.basketService.submitOrder();
    const dialogRef = this.dialog.open(DialogOrdered, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'dialog-ordered',
  templateUrl: 'dialog-ordered.html',
})
export class DialogOrdered {
  constructor(
    public dialogRef: MatDialogRef<DialogOrdered>) { }

  closeClick(): void {
    this.dialogRef.close();
  }
}
