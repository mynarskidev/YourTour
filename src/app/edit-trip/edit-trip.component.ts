import { ProductsService } from 'src/services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  myForm: FormGroup;
  tripId;

  constructor(
    public dialog: MatDialog,
    private productsService: ProductsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    this.tripId = tripId;
    this.productsService.getTrip(tripId).subscribe((trip: any) => {
      this.myForm = new FormGroup({
        name: new FormControl(trip.name),
        description: new FormControl(trip.description),
        startDate: new FormControl(trip.startDate),
        endDate: new FormControl(trip.endDate),
        category: new FormControl(trip.category),
        count: new FormControl(trip.count),
        price: new FormControl(trip.price),
        imageUrl: new FormControl(trip.imageUrl),
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onSubmit(form): void {
    const editedTrip = {
      ...form.value,
      id: this.tripId
    };
    this.productsService.editTrip(editedTrip);
  }
}

@Component({
  selector: 'dialog-overview-dialog',
  templateUrl: 'dialog-overview-dialog.html',
})
export class DialogOverview {
  constructor(
    public dialogRef: MatDialogRef<DialogOverview>) { }

  closeClick(): void {
    this.dialogRef.close();
  }
}
