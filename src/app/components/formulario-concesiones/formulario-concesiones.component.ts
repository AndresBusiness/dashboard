import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-formulario-concesiones',
  templateUrl: './formulario-concesiones.component.html',
  styleUrls: ['./formulario-concesiones.component.css']
})
export class FormularioConcesionesComponent implements OnInit {
  @Input() forma: any;
  @Input() i: any;
  @Input() tipo: string;
  @Output() crear = new EventEmitter();
  @Output() borrar = new EventEmitter();
  countAyudante = 0;
  constructor() {
    setTimeout(() => {

    }, 100);
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const arrayControl = this.forma.get('concesiones') as FormArray;
      for (let index = 0; index < arrayControl.length; index++) {
        const element = arrayControl.at(index);
        if (element['controls']['tipo'].value === 'Ayudante') {
          this.countAyudante++;
        }
      }
  }

  _removeArrayControls(indice: any) {
    this.borrar.emit({indice: indice});
  }
  _createArrayControls() {
    this.crear.emit();
  }

}
