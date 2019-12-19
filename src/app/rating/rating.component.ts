import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})

export class RatingComponent {
  @Output() ratingAdded = new EventEmitter<any>();
  @Input() avgRating: number;
  @Input() readonly;

  onRate($event) {
    this.ratingAdded.emit($event.newValue);
  }
}
