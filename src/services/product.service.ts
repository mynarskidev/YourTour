import { Injectable } from '@angular/core';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { SortType } from '../models/sortType';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class ProductsService {
    public allSortingTypes: Array<SortType> = [
        { title: 'Low Price First', matSortable: { id: 'price', start: 'asc', disableClear: false } },
        { title: 'High Price First', matSortable: { id: 'price', start: 'desc', disableClear: false } },
        { title: 'Ascending Names', matSortable: { id: 'name', start: 'asc', disableClear: false } },
        { title: 'Descending Names', matSortable: { id: 'name', start: 'desc', disableClear: false } }
    ];
    public selectedSortingType: SortType = { title: 'Low Price First', matSortable: { id: 'price', start: 'asc', disableClear: false } };
    allSortingTypesObservable = new BehaviorSubject(this.allSortingTypes);
    selectedSortingTypeObservable = new BehaviorSubject(this.selectedSortingType);

    private allCategories: Map<String, boolean> = new Map();
    allCategoriesObservable = new BehaviorSubject(this.allCategories);

    private selectedCountRange: { minValue: number, maxValue: number } | null = null;
    selectCountRangeObservable = new BehaviorSubject(this.selectedCountRange);

    private selectedPriceRange: { minValue: number, maxValue: number } | null = null;
    selectPriceRangeObservable = new BehaviorSubject(this.selectedPriceRange);

    private selectedRatingRange: { minValue: number, maxValue: number } | null = null;
    selectRatingRangeObservable = new BehaviorSubject(this.selectedRatingRange);

    private allProducts: Array<Product> = [];
    private sortedProducts: Array<Product> = this.allProducts;
    allProductsObservable = new BehaviorSubject(this.allProducts);
    sortedProductsObservable = new BehaviorSubject(this.sortedProducts);

    private allProductsQuery: AngularFireList<Product>
    constructor(
        private fireDatabase: AngularFireDatabase,
        private authService: AuthService
    ) {
        this.allProductsQuery = fireDatabase.list<Product>('trips')
        this.allProductsQuery.valueChanges().subscribe(databaseProducts => {
            this.allProducts = databaseProducts;
            this.allProductsObservable.next(databaseProducts);
            if (this.selectedPriceRange == null) {
                this.selectedPriceRange = { 'maxValue': this.maxPrice(), 'minValue': this.minPrice() }
                this.selectPriceRangeObservable.next(this.selectedPriceRange)
            }
            if (this.selectedCountRange == null) {
                this.selectedCountRange = { 'maxValue': this.maxCount(), 'minValue': this.minCount() };
                this.selectCountRangeObservable.next(this.selectedCountRange)
            }
            if (this.selectedRatingRange == null) {
                this.selectedRatingRange = { 'maxValue': this.maxRating(), 'minValue': this.minRating() };
                this.selectRatingRangeObservable.next(this.selectedRatingRange)
            }
            this.sortFilterProducts();
        });
        this.allCategories.set('Concert', true);
        this.allCategories.set('Sport', true);
        this.allCategories.set('Board games', true);
        this.allCategories.set('Other', true);
    }

    getAllCategories(): BehaviorSubject<Map<String, boolean>> {
        return this.allCategoriesObservable;
    }

    selectCategory(category: String): void {
        this.allCategories.set(category, true);
        this.allCategoriesObservable.next(this.allCategories)
        this.sortFilterProducts();
    }

    deselectCategory(category: String): void {
        this.allCategories.set(category, false);
        this.allCategoriesObservable.next(this.allCategories)
        this.sortFilterProducts();
    }

    maxCount(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var maxCount = this.allProducts[0].count
        this.allProducts.forEach(element => {
            if (maxCount < element.count) { maxCount = element.count; }
        });
        return maxCount;
    }

    minCount(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var minCount = this.allProducts[0].count
        this.allProducts.forEach(element => {
            if (minCount > element.count) { minCount = element.count; }
        });
        return minCount;
    }

    getSelectedCountRangeObservable(): BehaviorSubject<{ minValue: number, maxValue: number }> {
        return this.selectCountRangeObservable;
    }

    setCountRange(minCount: number, maxCount: number) {
        if (this.selectedCountRange == null) { return }
        this.selectedCountRange.maxValue = maxCount;
        this.selectedCountRange.minValue = minCount;
        this.selectCountRangeObservable.next(this.selectedCountRange);
        this.sortFilterProducts();
    }

    maxPrice(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var maxPrice = this.allProducts[0].price;
        this.allProducts.forEach(element => {
            if (maxPrice < element.price) { maxPrice = element.price; }
        });
        return maxPrice;
    }

    minPrice(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var minPrice = this.allProducts[0].price;
        this.allProducts.forEach(element => {
            if (minPrice > element.price) { minPrice = element.price; }
        });
        return minPrice;
    }

    getSelectedPriceRangeObservable(): BehaviorSubject<{ minValue: number, maxValue: number }> {
        return this.selectPriceRangeObservable;
    }

    setPriceRange(minPrice: number, maxPrice: number) {
        if (this.selectedPriceRange == null) { return }
        this.selectedPriceRange.maxValue = maxPrice;
        this.selectedPriceRange.minValue = minPrice;
        this.selectPriceRangeObservable.next(this.selectedPriceRange);
        this.sortFilterProducts();
    }

    countAvgRating(product) {
        const ratingArray = product.ratings
        if (ratingArray && ratingArray.length>0) {
            let sum = 0;
            let i = 0;
            ratingArray.forEach((element, index, array) => {
                sum+=element['rating'];
                i++
            });
            return Math.round(sum/i * 100) / 100;
        } else return 3
      }

    maxRating(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var maxRating = this.countAvgRating(this.allProducts[0]);
        this.allProducts.forEach(element => {
            if (maxRating < this.countAvgRating(element)) { maxRating = this.countAvgRating(element); }
        });
        return maxRating;
    }

    minRating(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var minRating = this.countAvgRating(this.allProducts[0]);
        this.allProducts.forEach(element => {
            if (minRating > this.countAvgRating(element)) { minRating = this.countAvgRating(element); }
        });
        return minRating;
    }

    getSelectedRatingRangeObservable(): BehaviorSubject<{ minValue: number, maxValue: number }> {
        return this.selectRatingRangeObservable;
    }

    setRatingRange(minRating: number, maxRating: number) {
        if (this.selectedRatingRange == null) { return }
        this.selectedRatingRange.maxValue = maxRating;
        this.selectedRatingRange.minValue = minRating;
        this.selectRatingRangeObservable.next(this.selectedRatingRange);
        this.sortFilterProducts();
    }

    getAllProductsObservable(): BehaviorSubject<Product[]> {
        return this.allProductsObservable;
    }

    fetchTrips() {
        return this.fireDatabase.list('/trips').valueChanges();
    }

    getSortedFilteredProducts(): BehaviorSubject<Product[]> {
        return this.sortedProductsObservable;
    }

    getTrip(id) {
        return this.fireDatabase.object(`/trips/${id}/`).valueChanges();
    }

    addProduct(product: Product) {
        this.allProducts.push(product);
    }

    addTrip(trip: any): void {
        const pushId = this.fireDatabase.createPushId();
        trip.id = pushId;
        this.fireDatabase.object(`/trips/${pushId}`).set(trip);
    }

    deleteProduct(tripId) {
        this.fireDatabase.object(`/trips/${tripId}`).remove();
    }

    addOrder(order: any) {
        forEach(get(order, 'trips'), trip => {
            this.updatePlaces(trip['id'], {reserved: trip.reserved});
            this.updatePlaces(trip['id'], {count: (trip.count-trip.reserved)});
        });
        const pushId = this.fireDatabase.createPushId();
        order.id = pushId;
        this.fireDatabase.object(`/orders/${pushId}`).set(order);
        return pushId;
    }

    updatePlaces(tripId, updatedData) {
        this.fireDatabase.object(`/trips/${tripId}`).update(updatedData);
      }

    fetchOrders() {
        return this.fireDatabase.list('/orders').valueChanges();
    }

    updateTrip(tripToUpdate): void {
        this.fireDatabase.object(`/trips/${tripToUpdate.id}`).update(tripToUpdate);
    }

    getUserRole(email) {
        return this.fireDatabase.list('/roles', (ref: any) => ref.orderByChild('email').equalTo(email)).valueChanges();
    }

    addRating(trip, newRating) {
        if (!('ratings' in trip)) {
            trip['ratings'] = [];
        }

        trip['ratings'].push({
            ratedBy: this.authService.getUser(),
            rating: newRating
        });

        this.fireDatabase.object(`/trips/${trip.id}`).set(trip);
    }

    editTrip(newTrip) {
        this.fireDatabase.object(`/trips/${newTrip.id}`).update(newTrip);
    }

    private sortFilterProducts() {
        this.sortedProducts = this.allProducts.filter((element, index, array) => {
            if (this.allCategories.has(element.category)) {
                if (this.allCategories.get(element.category) == false) {
                    return false;
                }
            } else {
                return false;
            }
            if (this.selectedCountRange != null) {
                if (!(element.count >= this.selectedCountRange.minValue
                    && element.count <= this.selectedCountRange.maxValue)) {
                    return false;
                }
            }
            if (this.selectedPriceRange != null) {
                if (!(element.price >= this.selectedPriceRange.minValue
                    && element.price <= this.selectedPriceRange.maxValue)) {
                    return false;
                }
            }
            if (this.selectedRatingRange != null) {
                if (!(this.countAvgRating(element) >= this.selectedRatingRange.minValue
                    && this.countAvgRating(element) <= this.selectedRatingRange.maxValue)) {
                    return false;
                }
            }
            return true;
        });
        this.sortedProductsObservable.next(this.sortedProducts);
    }
}
