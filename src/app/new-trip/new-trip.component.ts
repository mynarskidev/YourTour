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
      name: new FormControl('Uganda'),
      description: new FormControl('Fast and cheap'),
      startDate: new FormControl('2020-01-04'),
      endDate: new FormControl('2020-01-13'),
      category: new FormControl('Africa'),
      count: new FormControl(14),
      price: new FormControl(3400),
      imageUrl: new FormControl('https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Uganda.svg')
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
