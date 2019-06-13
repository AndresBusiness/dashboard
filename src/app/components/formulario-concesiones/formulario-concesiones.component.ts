import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario-concesiones',
  templateUrl: './formulario-concesiones.component.html',
  styleUrls: ['./formulario-concesiones.component.css']
})
export class FormularioConcesionesComponent implements OnInit {
  @Input() forma: FormGroup;
  @Input() i: any;
  @Output() crear = new EventEmitter();
  @Output() borrar = new EventEmitter();

  observablePrimerPlano: Subscription;
  
  constructor() {
   
   }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    this._observarControles();
  }

  _observarControles(){
    const arrayControl = this.forma.get('concesiones_que_trabaja') as FormArray;
    for (let index = 0; index < arrayControl.length; index++) {
      const element = arrayControl.at(index);
      this.observablePrimerPlano =  element.valueChanges.subscribe(data=>{
        if(this.forma.value.vehiculos_fijos[index] && data.placa !== '***'){
          this.forma.controls['vehiculos_fijos']['controls'][index]['controls']['concesion'].setValue(data.placa);
        }
      });
    }
  }

  _removeConcesion_Vehiculos(indice: any) {
    this.observablePrimerPlano.unsubscribe();
    this.borrar.emit({indice: indice});
    this._observarControles();
  }

  _addConcesion_Vehiculo(){
    this.crear.emit();
  }


}
