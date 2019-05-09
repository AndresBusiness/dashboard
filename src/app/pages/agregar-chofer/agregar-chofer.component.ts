import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-chofer',
  templateUrl: './agregar-chofer.component.html',
  styleUrls: ['./agregar-chofer.component.css']
})
export class AgregarChoferComponent implements OnInit {

  forma:FormGroup;
  menssageMaxLengthAyudanteconcesiones:string;

  constructor() {
    const uid = localStorage.getItem('uid');
    this.forma = new FormGroup({
      "folio": new FormControl('28940', Validators.required),
      "nombre": new FormControl('Andres', Validators.required),
      "apellidos": new FormControl('Perez Alonso', Validators.required),
      "correo": new FormControl('andres-tic@hotmail.com'),
      "telefono": new FormControl('4775674124', Validators.required),
      "etiqueta": new FormControl('1', Validators.required),
      "genero": new FormControl('1', Validators.required),
      "fechaNacimiento": new FormControl('05/01/1995', Validators.required),
      "img": new FormControl(''),
      "activo": new FormControl(false, Validators.required),
      "autorizado": new FormControl(true, Validators.required),
      "uidUserSystem": new FormControl(uid, Validators.required),
      "vehiculo": new FormGroup({
        "concesion": new FormControl(210, Validators.maxLength(3)),
        "modelo": new FormControl('2018', Validators.required),
        "marca": new FormControl('Mazda', Validators.required),
        "matricula": new FormControl('ERWS-2342D', Validators.required),
        "capacidad": new FormControl('4', Validators.required),
        "modalidad": new FormControl('1', Validators.required),
        "conRampa": new FormControl(false, Validators.required),
      }),
      "ayudante_concesiones": new FormArray([], Validators.required) 
    });

  }

  ngOnInit() {

  }

  guardarUsuario(){
     console.log(this.forma.value);
     this.forma.addControl('fechaRegistro', 
         new FormControl(moment().locale('es').format('MMMM Do YYYY, h:mm:ss a'), Validators.required));
     
  }

  crearRelacion(){
    if (this.forma.value.ayudante_concesiones.length < 3){
      (<FormArray>this.forma.controls['ayudante_concesiones']).push(
        new FormControl('', Validators.required))
    } else {
      this.menssageMaxLengthAyudanteconcesiones = 'solo se puede asociar a un máximo de 3 concesiones'
    }
  }

  sacarInputArrayList(index: any){
    this.forma.controls['ayudante_concesiones'].removeAt(index)
    if (this.forma.value.ayudante_concesiones.length < 3){
      this.menssageMaxLengthAyudanteconcesiones = ''
    } 
  }
}
