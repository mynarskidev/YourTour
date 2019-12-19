import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  myFormLogin: FormGroup;
  myFormRegister: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmitLogin() {
    this.authService.login({
      email: this.myFormLogin.value.email,
      password: this.myFormLogin.value.password,
    }).then(() => {
      this.router.navigate(['/home']);
    }).catch(e => {
      alert(e.message);
    });
  }

  ngOnInit(): void {
    this.myFormLogin = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });

    this.myFormRegister = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      repassword: new FormControl('')
    });
  }

  onSubmitRegister() {
    if(this.myFormRegister.value.password == this.myFormRegister.value.repassword){
      this.authService.register({
        email: this.myFormRegister.value.email,
        password: this.myFormRegister.value.password,
      }).then(() => {
        this.router.navigate(['/home']);
      }).catch(e => {
        alert(e.message);
      });
    }else alert("Re-entered password is not the same!")
  }
}
