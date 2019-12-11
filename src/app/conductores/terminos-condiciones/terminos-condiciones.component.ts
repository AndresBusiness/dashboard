import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {

  constructor() { }

  nombreApp:string = environment.appChofer;
  nombreEmpresa:string = environment.nombreEmpresa;

  ngOnInit() {
  }

}
