import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, Inject } from "@angular/core";
import { Product } from "src/models/product.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material";
import { BasketService } from "src/services/basketService";
import { ProductsService } from "src/services/product.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"]
})
export class ProductDetailComponent implements OnInit {
  isCanAdd: boolean = false;
  isCanRemove: boolean = false;
  product: Product | null;
  tripId: any;
  avgRating: any;
  orderPlaced: boolean;
  orders = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    public dialog: MatDialog,
    private basketService: BasketService,
    private productsService: ProductsService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.product = data;
    this.product.ratings = data.ratings;
  }

  ngOnInit() {
    this.productsService.fetchOrders().subscribe(orders => {
      this.orders = orders;
      this.canRate();
    });
    this.isCanAdd = this.product.count > 0;
    this.basketService
      .getbasketProductsObservable()
      .subscribe(basketProducts => {
        this.isCanRemove = this.basketService.countOfProduct(this.product) > 0;
        this.isCanAdd = this.product.count > 0;
      });
    const tripId = this.route.snapshot.paramMap.get("id");
    this.tripId = tripId;
    this.avgRating = this.countAvgRating();
    if (!this.orderPlaced) this.canRate();
    (<HTMLInputElement>document.getElementById("opinionTextArea")).value = "";
  }

  addOneProduct() {
    this.basketService.addOne(this.product);
  }

  removeOneProduct() {
    this.basketService.removeOne(this.product, true);
  }

  countAvgRating() {
    const ratingArray = this.product.ratings;
    if (ratingArray && ratingArray.length > 0) {
      let sum = 0;
      let i = 0;
      ratingArray.forEach((element, index, array) => {
        sum += element["rating"];
        i++;
      });
      return Math.round((sum / i) * 100) / 100;
    } else return "No Ratings Yet";
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

  submitOpinion() {
    //TODO add opinion to firebase
    (<HTMLInputElement>document.getElementById("opinionTextArea")).value = "";
    const dialogRef = this.dialog.open(DialogOpinion, {
      width: "450px"
    });
    dialogRef.afterClosed().subscribe(result => {});
    return false;
  }

  closeProduct() {
    this.dialogRef.close();
  }
}

@Component({
  selector: "dialog-ordered",
  template: `
    <h2 mat-dialog-title>Hello there!</h2>
    <mat-dialog-content>
      <p>We will notify out admins about your opinion, thanks!</p>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-raised-button color="accent" (click)="closeClick()">
        Close
      </button>
    </div>
  `
})
export class DialogOpinion {
  constructor(public dialogRef: MatDialogRef<DialogOpinion>) {}

  closeClick(): void {
    this.dialogRef.close();
  }
}
