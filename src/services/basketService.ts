import { Injectable, OnInit } from '@angular/core';
import { ProductsService } from './product.service';
import { Product } from 'src/models/product.model';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BasketService {
    private basketProducts: Map<String, Product> = new Map();
    private basketProductsObservable = new BehaviorSubject(Array.from(this.basketProducts.values()));
    private productsCount: number = 0;
    private productsCountObservable = new BehaviorSubject(0);
    private productsSum: number = 0;
    private productsSumObservable = new BehaviorSubject(0);
    private allProducts: Array<Product> = [];
    private priceForProduct: Map<String, number> = new Map();

    constructor(private productsService: ProductsService, private authService: AuthService, private router: Router) {
        this.productsService.getAllProductsObservable().subscribe(allProducts => {
            this.allProducts = allProducts;
            this.calculatePrices();
        });
    }

    getBasketProducts(): Array<Product> {
        return Array.from(this.basketProducts.values());
    }

    getbasketProductsObservable(): BehaviorSubject<Array<Product>> {
        return this.basketProductsObservable;
    }

    getProductsCountObservable(): BehaviorSubject<number> {
        return this.productsCountObservable;
    }

    getProductsSum(): number {
        return this.productsSum;
    }

    getProductsSumObservable(): BehaviorSubject<number> {
        return this.productsSumObservable;
    }

    countOfProduct(product: Product): number {
        if (!this.basketProducts.has(product.id)) { return 0 }
        return this.basketProducts.get(product.id).count;
    }

    getPriceForProduct(product: Product): number {
        if (this.priceForProduct.has(product.id)) {
            return this.priceForProduct.get(product.id)
        } else {
            return product.price;
        }
    }

    addOne(product: Product) {
        if (this.basketProducts.has(product.id) == false) {
            let newBasketProduct = {
                id: product.id,
                name: product.name,
                description: product.description,
                startDate: product.startDate,
                endDate: product.endDate,
                category: product.category,
                count: product.count,
                reserved: 0,
                price: product.price,
                ratings: product.ratings,
                imageUrl: product.imageUrl
            };
            this.basketProducts.set(newBasketProduct.id, newBasketProduct);
        }
        if (product.count > 0) {
            this.basketProducts.get(product.id).reserved += 1
            product.count -= 1
            this.recalculateBasket()
        }
    }

    removeOne(product: Product, withDelete: Boolean) {
        if (this.basketProducts.has(product.id)) {
            this.basketProducts.get(product.id).reserved -= 1
            product.count += 1
            if ((this.basketProducts.get(product.id).reserved == 0) && (withDelete == true)) {
                this.basketProducts.delete(product.id);
            }
        }
        this.recalculateBasket()
    }

    addOneFromBasket(product: Product) {
        var originalProductIndex = this.allProducts.findIndex(element => {
            return element.id == product.id
        });
        if (this.allProducts[originalProductIndex].count > 0) {
            product.reserved += 1;
            this.allProducts[originalProductIndex].count -= 1;
        }
        this.recalculateBasket()
    }

    removeOneFromBasket(product: Product) {
        if (product.reserved > 0) {
            product.reserved -= 1
            var originalProductIndex = this.allProducts.findIndex(element => {
                return element.id == product.id
            });
            this.allProducts[originalProductIndex].count += 1
        }
        this.recalculateBasket()
    }

    deleteFormBasket(product: Product) {
        if (this.basketProducts.has(product.id)) {
            let tempProduct = this.basketProducts.get(product.id);
            let originalProduct = this.allProducts.find(element => {
                return element.id == product.id;
            });
            originalProduct.count += tempProduct.count;
            tempProduct.count = 0;
            this.basketProducts.delete(product.id);
        }
        this.recalculateBasket()
    }

    submitOrder() {
        const orderToMake = {
            trips: Array.from(this.basketProducts.values()),
            owner: this.authService.getUser(),
            orderDate: new Date().toISOString()
        };
        this.productsService.addOrder(orderToMake);
        this.basketProducts.clear();
        this.recalculateBasket()
    }

    private recalculateBasket() {
        var totalCount = 0;
        var totalSum = 0;
        let products = Array.from(this.basketProducts.values());
        products.forEach(product => {
            totalCount += product.reserved;
            let productPrice = this.priceForProduct.get(product.id);
            totalSum += (product.reserved * productPrice);
        });
        this.productsCount = totalCount;
        this.productsSum = totalSum;
        this.productsCountObservable.next(this.productsCount);
        this.productsSumObservable.next(this.productsSum);
        this.basketProductsObservable.next(products);
    }

    private calculatePrices() {
        this.priceForProduct.clear
        this.allProducts.forEach(product => {
            this.priceForProduct.set(product.id, product.price)
        });
        this.recalculateBasket();
    }
}