import { ProductsService } from 'src/services/product.service';
import {Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import get from 'lodash/get';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private productsService: ProductsService, private fireAuth: AngularFireAuth) {}

  canActivate(): Promise<boolean> {
    const router = this.router;

    return new Promise((resolve) => {
      this.fireAuth.auth.onAuthStateChanged((user) => {
        if(user){
          this.productsService.getUserRole(user.email).subscribe(roles => {
            if (get(roles, '[0].role') === 'admin') {
              resolve(true);
            } else {
              router.navigate(['/home']);
              resolve(false);
            }
          });
        }else{
          router.navigate(['/home']);
            resolve(false);
        }
      });
    });
  }
}


