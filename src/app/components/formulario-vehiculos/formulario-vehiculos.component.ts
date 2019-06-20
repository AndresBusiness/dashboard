import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-formulario-vehiculos',
  templateUrl: './formulario-vehiculos.component.html',
  styleUrls: ['./formulario-vehiculos.component.css']
})
export class FormularioVehiculosComponent implements OnInit {

  @Input() forma: any;
  @Input() i: any;
  @Input() type: any;
  @Input() revisionVehiculos: any;
  

  constructor() { }

  ngOnInit() {
  }

}
