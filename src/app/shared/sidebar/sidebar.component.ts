import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: any;
  constructor(public _servicioAuth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = this._servicioAuth.usuario;
  }

  salir() {
    this._servicioAuth.Logout()
    .then(() => {
        this.router.navigate(['/login']);
    });
  }

}
