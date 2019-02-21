import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { LoadingBarService } from '@ngx-loading-bar/core';


declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    init_plugins();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }
  tryLogin(value) {
    this.startLoading();
    this.authService.Login(value)
    .then(user => {
      if (user) {
        console.log(user);
        this.authService._obtenerUsuarioCloudStorage(user.uid)
        .then(data => {
          if (data) {
            this.stopLoading();
            this.router.navigate(['/dashboard']);
          }
        });
      }
    }, err => {
      this.stopLoading();
      swal('Error!', err.message, 'error');
      // this.errorMessage = err.message;
    });
  }

  startLoading() {
    this.loadingBar.start();
  }

  stopLoading() {
      this.loadingBar.complete();
  }


}
