import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductsService } from "../../services/product.service";

@Component({
  selector: 'app-new-trip',
  styleUrls: ['./new-trip.component.css'],
  templateUrl: './new-trip.component.html',
})
export class NewTripComponent implements OnInit {
  myForm: FormGroup;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('Event 1'),
      description: new FormControl('Concert'),
      startDate: new FormControl('2020-05-04'),
      endDate: new FormControl('2020-07-13'),
      category: new FormControl('Concert'),
      count: new FormControl(14),
      price: new FormControl(3400),
      imageUrl: new FormControl('https://ss')
    });
  }

  onSubmit(form): void {
    const newTrip = {
      ...form.value,
      reserved: 0,
      ratings: [ {
        "ratedBy" : "admin@o2.pl",
        "rating" : 4
      }, {
        "ratedBy" : "admin@o2.pl",
        "rating" : 5
      }],
    };
    this.productsService.addTrip(newTrip);
  }
}
