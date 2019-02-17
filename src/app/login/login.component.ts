import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
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
    this.authService.Login(value)
    .then(user => {
      if (user) {
        this.authService._obtenerUsuarioCloudStorage(user.uid)
        .then(data => {
          if (data) {
            this.router.navigate(['/dashboard']);
          }
        });
      }
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }


}
