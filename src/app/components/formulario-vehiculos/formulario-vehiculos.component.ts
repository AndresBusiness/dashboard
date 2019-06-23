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


  capitalizaCamelCase(value: string , field:string, indice: number, type:string) {
    let newString = '';
    if (value) {
      const cadenas = value.split(' ');
      if (cadenas.length > 1) {
        for (let index = 0; index < cadenas.length; index++) {
          let element = cadenas[index];
              element = (element.charAt(0).toUpperCase() + element.slice(1));
          if (index  !== (cadenas.length - 1 )) {
            element = element + ' ';
          }
          newString += element;
        }
      } else {
        newString = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this.forma.controls[type]['controls'][indice]['controls'][field].setValue(newString);
      
    }
  }


}
