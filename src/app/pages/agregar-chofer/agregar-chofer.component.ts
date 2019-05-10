import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';
import { FunctionsService } from 'src/app/service/functions.service';

@Component({
  selector: 'app-agregar-chofer',
  templateUrl: './agregar-chofer.component.html',
  styleUrls: ['./agregar-chofer.component.css']
})
export class AgregarChoferComponent implements OnInit {

  public forma:FormGroup;
  public formArray: FormArray;
  public respuesta: any;
  menssageMaxLengthAyudanteconcesiones:string;

  constructor(private fb: FormBuilder, private _changeDetectionRef: ChangeDetectorRef, 
    private servicio: FunctionsService) {
    const uid = localStorage.getItem('uid');

    this.formArray = this.fb.array([], Validators.required);
    this.forma = new FormGroup({
      "folio": new FormControl('28940', Validators.required),
      "nombre": new FormControl('Andres', Validators.required),
      "apellidos": new FormControl('Perez Alonso', Validators.required),
      "correo": new FormControl('andres-tic@hotmail.com'),
      "telefono": new FormControl('+524775674124', Validators.required),
      "etiqueta": new FormControl('1', Validators.required),
      "genero": new FormControl('1', Validators.required),
      "fechaNacimiento": new FormControl('05/01/1995', Validators.required),
      "img": new FormControl(''),
      "concesion": new FormControl('210'),
      "propietarioVehiculo": new FormControl('1'),
      "activo": new FormControl(false, Validators.required),
      "autorizado": new FormControl(true, Validators.required),
      "uidUserSystem": new FormControl(uid, Validators.required),
      "vehiculo": new FormGroup({
        "concesion": new FormControl('210', Validators.maxLength(3)),
        "modelo": new FormControl('2018', Validators.required),
        "marca": new FormControl('Mazda', Validators.required),
        "matricula": new FormControl('ERWS-2342D', Validators.required),
        "capacidad": new FormControl('4', Validators.required),
        "modalidad": new FormControl('1', Validators.required),
        "conRampa": new FormControl(false, Validators.required),
      }),
      "ayudante_concesiones": this.formArray
    });

  }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    // Force another change detection in order to fix an occuring ExpressionChangedAfterItHasBeenCheckedError
    this._changeDetectionRef.detectChanges();
  }

  guardarUsuario(){
    this.respuesta = 'guardando';
     console.log(this.forma.value);
     this.servicio.registarChofer(this.forma.value).subscribe(data=>{
       this.forma.reset();
       this.respuesta = JSON.stringify(data); 
     });
     
  }

  crearRelacion(){
    if (this.forma.value.ayudante_concesiones.length < 3){
      this.formArray.push(new FormControl('', Validators.required))
    } else {
      this.menssageMaxLengthAyudanteconcesiones = 'solo se puede asociar a un máximo de 3 concesiones'
    }
  }

  sacarInputArrayList(index: any){
    this.formArray.removeAt(index);
    if (this.forma.value.ayudante_concesiones.length < 3){
      this.menssageMaxLengthAyudanteconcesiones = ''
    } 
  }
}
