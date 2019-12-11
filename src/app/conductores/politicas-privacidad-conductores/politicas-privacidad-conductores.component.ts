import { environment } from './../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-politicas-privacidad-conductores',
  templateUrl: './politicas-privacidad-conductores.component.html',
  styleUrls: ['./politicas-privacidad-conductores.component.css']
})
export class PoliticasPrivacidadConductoresComponent implements OnInit {

  constructor() { }
  nombreApp:string = environment.appChofer;
  nombreEmpresa:string = environment.nombreEmpresa;
  emailEmpresa:string = environment.emailEmpresa;

  ngOnInit() {
  }

}
