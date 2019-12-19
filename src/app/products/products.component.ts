import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ProductsService } from 'src/services/product.service';
import { Product } from 'src/models/product.model';
import { ProductsTableDS } from './products-table-datasource';
import { MatPaginator, MatSort, MatSortable, Sort } from '@angular/material';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  sortingTitle: string
  obj: MatSortable = { id: null, start: null, disableClear: false };
  lastSort: Sort | null = null;

  presentedProducts: Product[] = [];
  dataSource: ProductsTableDS;

  constructor(public productsService: ProductsService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.dataSource = new ProductsTableDS([], this.paginator, this.sort)
      this.dataSource.connect().subscribe(presentedProducts => {
        this.presentedProducts = presentedProducts;
      });
      this.productsService.getSortedFilteredProducts().subscribe(products => {
        this.dataSource.data = products;
      });
      this.sortingTitle = this.productsService.selectedSortingType.title;
    }, 1);
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.sort.sortChange.subscribe(event => {
        this.lastSort = event;
      })
    }, 1);
  }

  sortingChanged(event) {
    let sortingValue = this.productsService.allSortingTypes.find(element => {
      return element.title == event.value;
    })
    if (this.productsService.selectedSortingType != sortingValue) {
      this.productsService.selectedSortingType = sortingValue
      this.sortingTitle = sortingValue.title
      this.apply()
    }
  }

  apply() {
    let objSort = this.productsService.selectedSortingType.matSortable;
    let empty: MatSortable = { id: '', start: 'asc', disableClear: false }
    this.sort.sort(empty);
    this.sort.sort(objSort);
    this.sort.active = objSort.id;
    this.sort.direction = objSort.start;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.cdref.detectChanges();
  }
}
