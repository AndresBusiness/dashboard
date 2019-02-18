import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: any;
  constructor(private servicioAuth: AuthService,
              private router: Router,
              public _usuario: AuthService) { }

  ngOnInit() {
    this.usuario = this._usuario.usuario;
  }

  salir() {
    this.servicioAuth.Logout()
    .then(() => {
        this.router.navigate(['/login']);
    });
  }

}
