import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductComponent } from "./product.component";
import { MatDialog, MatButtonModule, MatCardModule } from "@angular/material";
import { ProductsService } from "src/services/product.service";
import { BasketService } from "src/services/basketService";
import { Product } from "src/models/product.model";
import { BehaviorSubject } from "rxjs";
import { ProductDetailComponent } from "../product-detail/product-detail.component";

class MockMatDialog {
  open() {}
}
class MockProductsService {
  mockProducts: Array<Product>;
  constructor(private mockProductsArray: Array<Product>) {
    this.mockProducts = mockProductsArray;
  }

  getAllProductsObservable(): BehaviorSubject<Product[]> {
    return new BehaviorSubject(this.mockProducts);
  }
}
class MockBasketService {
  mockProduct: Product;
  mockProducts: Array<Product>;
  mockCount = 10;
  constructor() {
    this.mockProduct = new Product();
    this.mockProduct.id = "mockProduct.id";
    this.mockProduct.name = "name";
    this.mockProduct.description = "this.mockProduct.description";
    this.mockProduct.category = "category";
    this.mockProduct.count = 20;
    this.mockProduct.price = 10;
    this.mockProduct.imageUrl = "imageUrl";
    this.mockProducts = [this.mockProduct];
  }
  getbasketProductsObservable(): BehaviorSubject<Array<Product>> {
    return new BehaviorSubject(this.mockProducts);
  }
  countOfProduct(product: Product): number {
    return this.mockCount;
  }
  addOne(product: Product) {}
  removeOne(product: Product, withDelete: Boolean) {}
}

describe("TripComponent", () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  let mockMatDialog: MockMatDialog;
  let mockProductsService: MockProductsService;
  let mockBasketService: MockBasketService;

  beforeEach(async(() => {
    mockMatDialog = new MockMatDialog();
    mockBasketService = new MockBasketService();
    mockProductsService = new MockProductsService(
      mockBasketService.mockProducts
    );

    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatCardModule],
      declarations: [ProductComponent]
    })
      .overrideComponent(ProductComponent, {
        set: {
          providers: [
            { provide: MatDialog, useValue: mockMatDialog },
            { provide: ProductsService, useValue: mockProductsService },
            { provide: BasketService, useValue: mockBasketService }
          ]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = mockBasketService.mockProduct;
  });

  it("should create", () => {
    let spyBasket = spyOn(
      mockBasketService,
      "getbasketProductsObservable"
    ).and.callThrough();
    let spyProductService = spyOn(
      mockProductsService,
      "getAllProductsObservable"
    ).and.callThrough();
    fixture.detectChanges();

    expect(spyBasket.calls.any()).toBe(true);
    expect(spyProductService.calls.any()).toBe(true);
    expect(component).toBeTruthy();
  });

  it("Can manage basket", () => {
    mockBasketService.mockProduct.count = 20;
    mockBasketService.mockCount = 30;
    fixture.detectChanges();
    expect(component.isCanRemove).toEqual(true);
    expect(component.isCanAdd).toEqual(true);
  });

  it("Can`t manage basket", () => {
    mockBasketService.mockProduct.count = 0;
    mockBasketService.mockCount = 0;
    fixture.detectChanges();
    expect(component.isCanRemove).toEqual(false);
    expect(component.isCanAdd).toEqual(false);
  });

  it("Add one Trip", () => {
    let event = new Event("click");
    let spyEvent = spyOn(event, "stopPropagation").and.callFake(() => {});
    let spyBasket = spyOn(mockBasketService, "addOne").and.callFake(
      (product: Product) => {
        expect(product).toEqual(mockBasketService.mockProduct);
      }
    );

    fixture.detectChanges();
    expect(spyEvent.calls.any()).toBe(false);
    expect(spyBasket.calls.any()).toBe(false);

    component.addOneProduct(event);

    expect(spyEvent.calls.any()).toBe(true);
    expect(spyBasket.calls.any()).toBe(true);
  });

  it("Remove one Trip", () => {
    let event = new Event("click");
    let spyEvent = spyOn(event, "stopPropagation").and.callFake(() => {});
    let spyBasket = spyOn(mockBasketService, "removeOne").and.callFake(
      (product: Product, isDelete: boolean) => {
        expect(product).toEqual(mockBasketService.mockProduct);
        expect(isDelete).toEqual(true);
      }
    );

    fixture.detectChanges();
    expect(spyEvent.calls.any()).toBe(false);
    expect(spyBasket.calls.any()).toBe(false);

    component.removeOneProduct(event);

    expect(spyEvent.calls.any()).toBe(true);
    expect(spyBasket.calls.any()).toBe(true);
  });

  it("Open trip detail", () => {
    let event = new Event("click");
    let spyBasket = spyOn(mockMatDialog, "open").and.callFake(
      (
        componentName,
        detail: { width: string; height: string; data: Product }
      ) => {
        expect(detail.data).toEqual(mockBasketService.mockProduct);
        expect(detail.width).toEqual("1000px");
        expect(detail.height).toEqual("650px");
        expect(componentName).toEqual(ProductDetailComponent);
      }
    );

    fixture.detectChanges();

    expect(spyBasket.calls.any()).toBe(false);
    component.openProductDetail(event);

    expect(spyBasket.calls.any()).toBe(true);
  });
});
