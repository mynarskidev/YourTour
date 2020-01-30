import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FiltersComponent } from "./filters.component";
import { ProductsService } from "src/services/product.service";
import { BehaviorSubject } from "rxjs";
import { Ng5SliderModule } from "ng5-slider";
import {
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatFormFieldModule
} from "@angular/material";

export class MockProductService {
  mockKey = "Continents";
  mockCategories = new Map().set(this.mockKey, true);
  getAllCategories(): BehaviorSubject<Map<String, boolean>> {
    return new BehaviorSubject<Map<String, boolean>>(this.mockCategories);
  }
  getSelectedPriceRangeObservable(): BehaviorSubject<{
    minValue: number;
    maxValue: number;
  }> {
    return new BehaviorSubject({ minValue: 1, maxValue: 10000 });
  }
  getSelectedCountRangeObservable(): BehaviorSubject<{
    minValue: number;
    maxValue: number;
  }> {
    return new BehaviorSubject({ minValue: 1, maxValue: 10000 });
  }
  selectCategory(category: String): void {}
  deselectCategory(category: String): void {}

  setPriceRange(minPrice: number, maxPrice: number) {}
  setCountRange(minCount: number, maxCount: number) {}

  maxCount() {
    return 40;
  }
  minCount() {
    return 1;
  }
  maxPrice() {
    return 100000;
  }
  minPrice() {
    return 1;
  }
}

describe("FiltersComponent", () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let productService: MockProductService;
  let mockPriceRange: BehaviorSubject<{ minValue: number; maxValue: number }>;

  beforeEach(async(() => {
    productService = new MockProductService();
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatListModule,
        MatSliderModule,
        MatSlideToggleModule,
        Ng5SliderModule
      ],
      declarations: [FiltersComponent]
    })
      .overrideComponent(FiltersComponent, {
        set: {
          providers: [{ provide: ProductsService, useValue: productService }]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.debugElement.nativeElement.style.visibility = "hidden";
  });

  it("should create", () => {
    let spyCategoriesSelect = spyOn(
      productService,
      "selectCategory"
    ).and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(spyCategoriesSelect.calls.any()).toBe(
      false,
      "Categories shouldn't selected"
    );
  });
  it("Trips count range", () => {
    let spyCountRange = spyOn(
      productService,
      "getSelectedCountRangeObservable"
    ).and.callThrough();
    fixture.detectChanges();
    expect(spyCountRange.calls.any()).toBe(
      true,
      "Component should get current count ranges before start works"
    );
    expect(component.maxCount).toEqual(100);
    expect(component.minCount).toEqual(1);
  });
  it("Price count range", () => {
    let spyPriceRange = spyOn(
      productService,
      "getSelectedPriceRangeObservable"
    ).and.callThrough();
    fixture.detectChanges();
    expect(spyPriceRange.calls.any()).toBe(
      true,
      "Component should get current price ranges before start works"
    );
    expect(component.maxPrice).toEqual(100);
    expect(component.minPrice).toEqual(1);
  });
});
