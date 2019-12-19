import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FiltersComponent } from './filters/filters.component';
import { ProductComponent } from './product/product.component';
import { BasketComponent, DialogOrdered } from './basket/basket.component';
import { ProductsService } from 'src/services/product.service';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Ng5SliderModule } from 'ng5-slider';
import { RatingModule } from 'ng-starrating';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Angular2ImageGalleryModule } from "angular2-image-gallery";
import { AngularDateTimePickerModule } from "angular2-datetimepicker";
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxGalleryModule } from 'ngx-gallery';
import { CdkTableModule } from '@angular/cdk/table';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
  MatSidenavModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { ProductDetailComponent, DialogOpinion } from './product-detail/product-detail.component';
import { FooterComponent } from './footer/footer.component';
import { RatingComponent } from './rating/rating.component';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { NewTripComponent } from './new-trip/new-trip.component';
import { OrdersComponent } from './orders/orders.component';
import { EditTripComponent, DialogOverview } from './edit-trip/edit-trip.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductsComponent,
    HomePageComponent,
    FiltersComponent,
    ProductComponent,
    BasketComponent,
    ProductDetailComponent,
    FooterComponent,
    RatingComponent,
    LoginComponent,
    AdminPanelComponent,
    NewTripComponent,
    OrdersComponent,
    EditTripComponent,
    DialogOverview,
    DialogOrdered,
    DialogOpinion
  ],
  imports: [
    NgbModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    Ng5SliderModule,
    RatingModule,
    AngularMultiSelectModule,
    Angular2ImageGalleryModule,
    AngularDateTimePickerModule,
    NgxGalleryModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatFormFieldModule,
    CdkTableModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    })
  ],
  entryComponents: [
    ProductDetailComponent,
    DialogOverview,
    DialogOrdered,
    DialogOpinion
  ],
  providers: [ProductsService],
  bootstrap: [
    AppComponent],
})
export class AppModule { }
