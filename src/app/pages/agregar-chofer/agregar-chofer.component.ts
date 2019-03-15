import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';


@Component({
  selector: 'app-agregar-chofer',
  templateUrl: './agregar-chofer.component.html',
  styleUrls: ['./agregar-chofer.component.css']
})
export class AgregarChoferComponent implements OnInit {

  forma:FormGroup;

  userChofer: any = {
    "datos-personales": {
      "folio":"",
      "nombre":"",
      "apellidos":"",
      "correo":"",
      "telefono":"",
      "etiqueta":"",
      "genero":"",
      "fechaNacimiento":"",
      "img":""
    },
    "datos-vehiculo": [{
      "tipo":"",
      "modelo":"",
      "marca":"",
      "matricula":"",
      "conRampa":"",
      "num-concesion":"",
      "folioAsociado":""
    }]


  }

  constructor() {
    this.forma = new FormGroup({
      "folio": new FormControl('28940', Validators.required),
      "nombre": new FormControl('', Validators.required),
      "apellidos": new FormControl('Perez Alonso', Validators.required),
      "correo": new FormControl('andres-tic@hotmail.com'),
      "telefono": new FormControl('4775674124', Validators.required),
      "etiqueta": new FormControl('0', Validators.required),
      "genero": new FormControl('1'),
      "fechaNacimiento": new FormControl('05/01/1995'),
      "img": new FormControl('https://scontent.fcjs3-2.fna.fbcdn.net/v/t1.0-9/49300537_2051461048277414_8579443709177757696_n.jpg?_nc_cat=109&_nc_eui2=AeHxl5et_EU1EWw9Fp0rUvpj-ONaL8YVxRJpFBWOakdrGFH8016-RGqbiOmPBAec_rmBohZkprkRNGHKTpYh8BLAOB4cuH-DxJS_mmfEn8zGh4uQaYF9UMbqYsvtI3LaWT4&_nc_ht=scontent.fcjs3-2.fna&oh=85d2572aeaf392f04487db08d54d5096&oe=5CF0A56F'),

    });

  }

  ngOnInit() {

  }

  guardarUsuario(){
     console.log(this.forma.value);
  }
}
