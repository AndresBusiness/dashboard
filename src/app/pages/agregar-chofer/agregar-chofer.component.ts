import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';
import { FunctionsService } from 'src/app/service/functions.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-chofer',
  templateUrl: './agregar-chofer.component.html',
  styleUrls: ['./agregar-chofer.component.css']
})
export class AgregarChoferComponent implements OnInit {

  public forma:FormGroup;
  public formArray: FormArray;
  public respuesta: any;
  error:string;
  imageSrc: any;
  fileImg: any;
  counttimeUploading:number= 0;

  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;

  constructor(private fb: FormBuilder, private _changeDetectionRef: ChangeDetectorRef, 
    private servicio: FunctionsService, private _storage: AngularFireStorage) {
    const uid = localStorage.getItem('uid');

    this.formArray = this.fb.array([]);
    this.forma = new FormGroup({
      "folio": new FormControl('28940', Validators.required),
      "nombre": new FormControl('Andres', Validators.required),
      "apellidos": new FormControl('Perez Alonso', Validators.required),
      "correo": new FormControl('andres-tic@hotmail.com'),
      "telefono": new FormControl('+524775674124', Validators.required),
      "etiqueta": new FormControl('-1', Validators.required),
      "genero": new FormControl('1', Validators.required),
      "fechaNacimiento": new FormControl('05/01/1995', Validators.required),
      "img": new FormControl(''),
      "concesion": new FormControl('210'),
      "propietarioVehiculo": new FormControl(true, Validators.required),
      "activo": new FormControl(false, Validators.required),
      "autorizado": new FormControl(true, Validators.required),
      "uidUserSystem": new FormControl(uid, Validators.required),
      "vehiculo": new FormGroup({
        "concesion": new FormControl('210', Validators.maxLength(3)),
        "modelo": new FormControl('2018', Validators.required),
        "marca": new FormControl('Mazda', Validators.required),
        "matricula": new FormControl('ERWS-2342D', Validators.required),
        "capacidad": new FormControl('-1', Validators.required),
        "modalidad": new FormControl('-1', Validators.required),
        "conRampa": new FormControl(false, Validators.required),
      }),
      "ayudante_concesiones": this.formArray
    });

    // OBSERVA LOS CAMBIOS EN EL CAMPO DE FECHA PARA HACER SU VALIDACION
    this.forma.controls['concesion'].valueChanges
    .subscribe(data=>{
      if(this.forma.value.propietarioVehiculo === '1' || this.forma.value.propietarioVehiculo ===  true){
        this.forma.value.vehiculo.concesion = data
      }
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
    const form = this.forma.value;
    form.propietarioVehiculo = form.propietarioVehiculo ? '1':'-1';
    if(form.etiqueta === '1'){
      form.concesion = (form.concesion).toString();
      if(form.propietarioVehiculo === '1'){
        form.vehiculo.concesion = (form.vehiculo.concesion).toString();      
      }
    } else {
      form.concesion = '-1';
      if(form.propietarioVehiculo === '1'){
        form.vehiculo.concesion = '-1';      
      }
    }
     console.log(form);
       const filepath = `choferes/${ form.folio}`;
       const fileRef = this._storage.ref(filepath);
       const task = this._storage.upload(filepath, this.fileImg);
       this.uploadProgress = task.percentageChanges();
       this.uploadProgress.subscribe(count => {
         this.counttimeUploading= count;
         console.log(count);
       });
       task.snapshotChanges().pipe(
         finalize(() => {
             this.uploadURL = fileRef.getDownloadURL()
             this.uploadURL.subscribe(urlPath=>{
               form.img = urlPath;
               this.servicio.registarChofer(form).subscribe(data=>{
                this.forma.reset();
                this.respuesta = JSON.stringify(data); 
              });

             });
         })).subscribe();
  }

  crearRelacion(){
    if (this.forma.value.ayudante_concesiones.length < 3){
      this.formArray.push(new FormControl(''))
    } else {
      this.error = 'solo se puede asociar a un máximo de 3 concesiones';
    }
  }

  sacarInputArrayList(index: any){
    this.formArray.removeAt(index);
    if (this.forma.value.ayudante_concesiones.length < 3){
      this.error = ''
    } 
  }

  upload(event) {
    this.fileImg = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.fileImg);
    
  }
}
