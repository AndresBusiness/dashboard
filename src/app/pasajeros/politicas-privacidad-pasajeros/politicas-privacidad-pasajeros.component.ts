import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-politicas-privacidad-pasajeros',
  templateUrl: './politicas-privacidad-pasajeros.component.html',
  styleUrls: ['./politicas-privacidad-pasajeros.component.css']
})
export class PoliticasPrivacidadPasajerosComponent implements OnInit {

  constructor() { }
  nombreApp:string = environment.appPasajero;
  nombreEmpresa:string = environment.nombreEmpresa;
  emailEmpresa:string = environment.emailEmpresa;
  ngOnInit() {
  }

}
