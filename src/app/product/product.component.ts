import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, Input } from "@angular/core";
import { Product } from "../../models/product.model";
import { BasketService } from "src/services/basketService";
import { MatDialog } from "@angular/material";
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { ProductsService } from "src/services/product.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"]
})
export class ProductComponent implements OnInit {
  basketProducts: Array<Product>;
  @Input() product: Product;
  @Input() isCheapest: boolean;
  @Input() isMostExpensive: boolean;
  isCanAdd: boolean = false;
  isCanRemove: boolean = false;
  orderPlaced: boolean;
  alreadyRated: boolean = false;
  minElement: any;
  maxElement: any;
  avgRating: any;
  orders = [];
  constructor(
    public dialog: MatDialog,
    private productsService: ProductsService,
    private basketService: BasketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.productsService.fetchOrders().subscribe(orders => {
      this.orders = orders;
      this.canRate();
    });
    this.isCanAdd = this.product.count > 0;
    this.basketService
      .getbasketProductsObservable()
      .subscribe(basketProducts => {
        this.basketProducts = basketProducts;
        this.isCanRemove = this.basketService.countOfProduct(this.product) > 0;
        this.isCanAdd = this.product.count > 0;
      });
    this.productsService.getAllProductsObservable().subscribe(products => {
      let myProduct = products.find(element => {
        return element.id == this.product.id;
      });
      if (myProduct != null) {
        this.product = myProduct;
      }
    });
    this.alreadyRated = this.didRateBefore();
    this.avgRating = this.countAvgRating();
    this.findMinElement();
    this.findMaxElement();
    if (!this.orderPlaced) this.canRate();
  }

  addOneProduct(event: Event) {
    this.basketService.addOne(this.product);
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  removeOneProduct(event: Event) {
    this.basketService.removeOne(this.product, true);
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  findMinElement() {
    this.minElement = this.productsService.minPrice();
  }

  findMaxElement() {
    this.maxElement = this.productsService.maxPrice();
  }

  canRate() {
    const filteredOrders = this.orders.filter((order: any) => {
      const tripsIds = order.trips.map(product => product["id"]);
      return (
        "owner" in order &&
        order.owner == this.authService.getUser() &&
        tripsIds.includes(this.product.id)
      );
    });
    this.orderPlaced = filteredOrders.length > 0;
  }

  didRateBefore() {
    const ratedBy = this.product.ratings.map(product => product["ratedBy"]);
    return ratedBy.includes(this.authService.getUser());
  }

  openProductDetail(event) {
    const dialogRef = this.dialog.open(ProductDetailComponent, {
      width: "82vw",
      height: "85vh",
      data: this.product
    });

    dialogRef.afterClosed().subscribe(result => {
      return null;
    });
  }

  addRating(newRating) {
    this.productsService.addRating(this.product, newRating);
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  countAvgRating() {
    const ratingArray = this.product.ratings;
    if (ratingArray) {
      let sum = 0;
      let i = 0;
      ratingArray.forEach((element, index, array) => {
        sum += element["rating"];
        i++;
      });
      return Math.round((sum / i) * 100) / 100;
    } else return "No Ratings Yet";
  }
}
