import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';
import { FunctionsService } from 'src/app/service/functions.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { NgbDateCustomParserFormatter } from 'src/app/service/dateformat.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
@Component({
  selector: 'app-agregar-chofer',
  templateUrl: './agregar-chofer.component.html',
  styleUrls: ['./agregar-chofer.component.css']
})
export class AgregarChoferComponent implements OnInit {

  public forma:FormGroup;
  public concesiones_que_trabajaArray: FormArray;
  public vehiculos_fijosArray: FormArray;
  public vehiculos_posturerosArray: FormArray;
  public choferesArray: FormArray;
  horalocal: string =  (Math.round(Math.random()*999999)).toString();

  public respuesta: any;
  fecha:string;
  error: string;
  imageSrc: any;
  fileImg: any;
  counttimeUploading: number= 0;
  step2: boolean = true;
  public minDate: any;
  public maxDate: any;
  public startDate: any;

  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  public expRefEmail    = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  revisionStep1: boolean = false;
  revisionStep2: boolean = false;
  esPropietarioDePlaca: boolean = false;
  placaSinVehiculo : boolean = false;

  public loading = false;

  @ViewChild('continuarStep2') continuarStep2: ElementRef;
  @ViewChild('continuarStep3') continuarStep3: ElementRef;
  @ViewChild('finishReset') finishReset: ElementRef;
  @ViewChild('sinVehiculos') sinVehiculos: ElementRef;

  

  vehiculoRegistrado: any[] = [];
  public resetCount = 0;

  VALIDATIONS_STEP1 = {
    'nombre':   false,
    'apellidos':   false,
    'correo':   false,
    'telefono':   false,
    'fechaNacimiento':   false,
    'img':   false,
  };

  VALIDATIONS_STEP2 = {
    'folio':   false,
    'etiqueta':   false,
    'concesion':   false,
  };

  constructor(private fb: FormBuilder, private _changeDetectionRef: ChangeDetectorRef,
    public servicioFecha: NgbDateCustomParserFormatter,
    private firebaseService: FirebaseService,
    public router: Router,
    private servicio: FunctionsService, private _storage: AngularFireStorage) {
    this.minDate = {year: 1950, month: 1, day: 1};
    this.maxDate = {year: 2001, month: 1, day: 1};
    this.startDate = {year: 1973, month: 6, day: 15};

    const uid = localStorage.getItem('uid');

    this.concesiones_que_trabajaArray = this.fb.array([]);
    this.vehiculos_fijosArray = this.fb.array([]);
    this.vehiculos_posturerosArray = this.fb.array([]);


    this.forma = new FormGroup({
      'folio':           new FormControl('thert', Validators.required),
      'nombre':          new FormControl('sdrtht', Validators.required),
      'apellidos':       new FormControl('ertjtr', Validators.required),
      'correo':          new FormControl('andres-eee@gerserger.com', [Validators.required, Validators.pattern(this.expRefEmail)]),
      'telefono':        new FormControl('4775642132', [Validators.required, Validators.minLength(10)]),
      'etiqueta':        new FormControl('', Validators.required),
      'genero':          new FormControl('1', Validators.required),
      'fechaNacimiento': new FormControl('', [Validators.required, this.validarFecha]),
      'img':             new FormControl('', Validators.required),
      'activo':               new FormControl(false, Validators.required),
      'autorizado':           new FormControl(true, Validators.required),
      'uidUserSystem':        new FormControl(uid, Validators.required),
      'concesiones_que_trabaja': this.concesiones_que_trabajaArray,
      'vehiculos_fijos':         this.vehiculos_fijosArray,
      'vehiculos_postureros':    this.vehiculos_posturerosArray
    });

    this.forma.controls['etiqueta'].valueChanges
    .subscribe(dataEtiqueta => {
      if (dataEtiqueta === '1' || dataEtiqueta ===  true) {
        this.esPropietarioDePlaca = true;
        this.forma.addControl('concesion_socio',
        new FormControl('***', [Validators.required, Validators.maxLength(3), Validators.max(765), Validators.min(1)]));
        this.forma.controls['concesion_socio'].valueChanges.subscribe(dataConcesionSocio => {
          this.validarConcesion(dataConcesionSocio)
        });
      } else {
        this.esPropietarioDePlaca = false;
        this.forma.removeControl('concesion_socio');
      }
    });

    this.forma.controls['fechaNacimiento'].valueChanges
    .subscribe(data => {
      this.fecha = this.servicioFecha.format(data);
    });

    const fieldStep1 = ['nombre', 'apellidos', 'correo', 'telefono', 'fechaNacimiento', 'img']
    for (let index = 0; index < fieldStep1.length; index++) {
      this.forma.controls[fieldStep1[index]].statusChanges.subscribe(data => {
        if (data === 'VALID') {this.VALIDATIONS_STEP1[fieldStep1[index]] = true; }
      });
    }

    this._pushConcesion_Vehiculos('1');
  }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this._changeDetectionRef.detectChanges();
  }

  validarConcesion(placa: string) {
    if (placa !== '***' && placa !== "") {
        const controlConcesion = (this.forma.controls['concesion_socio'] as FormControl)
        this.firebaseService.buscarInfoConcesion(placa).then(result=>{
        if(result){
          controlConcesion.setErrors({existe: true});
        } else {
          controlConcesion.setErrors(null);
        }
      });
    }
  }

  paso1() {
    let countErrrors = 0;
    const fieldStep1 = ['nombre', 'apellidos', 'correo', 'telefono', 'fechaNacimiento', 'img']
    for (let index = 0; index < fieldStep1.length; index++) {
      const element = fieldStep1[index];
     if (this.forma.controls[element].errors) {
       this.VALIDATIONS_STEP1[element] = true;
        countErrrors ++;
      }
      this.forma.controls[element].statusChanges.subscribe(data => {
        if (data === 'INVALID') {
          this.revisionStep1 = false;
        }
      });
    }
    this.revisionStep1 = countErrrors > 0 ? false : true;
    if (this.revisionStep1) {
      this.continuarStep2.nativeElement.click();
    }
  }

  paso2() {
    let countErrrors = 0;
    const fieldStep2 = ['folio', 'etiqueta']
    for (let index = 0; index < fieldStep2.length; index++) {
      const element = fieldStep2[index];
      if (this.forma.controls[element]) {
        if (this.forma.controls[element].errors) {
          this.VALIDATIONS_STEP2[element] = true;
          countErrrors ++;
       }
       this.forma.controls[element].statusChanges.subscribe(data => {
         if (data === 'INVALID') {
           this.revisionStep2 = false;
         }
       });
       if (countErrrors > 0 && index === fieldStep2.length -1) {
         return;
       }
      }
    }

    for (let index = 0; index < this.forma.value.concesiones_que_trabaja.length; index++) {
        const placa = (this.forma.controls['concesiones_que_trabaja']['controls'][index]['controls']['placa'] as FormControl);
        if (placa.value === '***') {
          placa.setErrors({required: true});
        }
        if (placa.errors) {
          if (placa.errors['required'] || placa.errors['max'] || placa.errors['min']
          || placa.errors['maxLength'] || placa.errors['Mask error']) {
            countErrrors ++;
          }
        }  else {
          this._consultarVehiculo(placa.value.toString(), this.forma.controls['vehiculos_fijos']['controls'][index]['controls']);
        }
    }

    if (this.forma.controls['concesion_socio']) {
      const placa = (this.forma.controls['concesion_socio'] as FormControl)
      if (placa.value === '***') {
        placa.setErrors({required: true});
      }
      if (placa.errors) {
        if (placa.errors['required'] || placa.errors['max'] || placa.errors['min']
        || placa.errors['maxLength'] || placa.errors['Mask error'] ||  placa.errors['existe'] ) {
          countErrrors ++;
        }
      }
    }
    this.revisionStep2 = countErrrors > 0 ? false : true;
    if (this.revisionStep2) {
      if(this.forma.value.etiqueta === '0' 
       && this.forma.value.vehiculos_postureros.length === 0
       && this.forma.value.vehiculos_fijos.length === 0){
        this.continuarStep3.nativeElement.click();
        setTimeout(() => {
          this.sinVehiculos.nativeElement.click();          
        }, 200);
      } else {
        this.continuarStep3.nativeElement.click();
      }
    }
  }

  _consultarVehiculo(placa: string, control: any){
    this.firebaseService.buscarInfoVehiculo(placa)
    .subscribe((vehiculo: any) => {
      if (vehiculo[0]) {
        if (vehiculo[0].propietario) {
            this.firebaseService.buscarInfoChofer(vehiculo[0].propietario)
            .then(chofer => {
               this._asignarDatosVehiculo(control, vehiculo[0], chofer.nombre + ' ' + chofer.apellidos);
            });
        }
        else if (vehiculo[0].choferes) {
            this.firebaseService.buscarInfoChofer(vehiculo[0].choferes[0])
            .then(chofer => {
              this._asignarDatosVehiculo(control, vehiculo[0], chofer.nombre + ' ' + chofer.apellidos);
            });
        }
      }
        else {
          if(control['nombreChoferRegistro']){
            control['modelo'].setValue(null);
            control['marca'].setValue(null);
            control['anio'].setValue(null);
            control['matricula'].setValue(null);
            control['modalidad'].setValue('1');
            control['capacidad'].setValue('-1');
            control['conRampa'].setValue(false);
            control['nombreChoferRegistro'].setValue(null);
            control['fechaRegistro'].setValue(null);
            control['choferes'].setValue(null);
            control['idVehiculo'].setValue(null);
          }
       }
    });
  }

  _asignarDatosVehiculo(control: any, datos: any, nombreChofer:string){
    console.log(datos);
    control['modelo'].setValue(datos.modelo);
    control['marca'].setValue(datos.marca);
    control['anio'].setValue(datos.anio);
    control['matricula'].setValue(datos.matricula);
    control['modalidad'].setValue(datos.modalidad);
    control['capacidad'].setValue(datos.capacidad);
    control['conRampa'].setValue(datos.conRampa);
    control['fechaRegistro'].setValue(datos.fechaRegistro);
    control['idVehiculo'].setValue(datos.idVehiculo);
    control['choferes'].setValue(datos.choferes);
    control['nombreChoferRegistro'].setValue(nombreChofer);
    console.log(control)
  }

  capitalizaCamelCase(value: string , control) {
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
      this.forma.controls[control].setValue(newString);
    }
  }

  validarFecha(control: FormControl): {[s: string]: boolean} {
    if (control.value) {
      if (control.value.month > 13 && control.value.month >= 1
        && control.value.day >= 1 && control.value.day < 32) {
        return {
          formatoFecha: true
        }
      }
    }
    return null;
  }

  guardarUsuario() {
    this.loading = true;
    this.respuesta = 'guardando';
    const form = this.forma.value;
    form.telefono = form.telefono;
    form.fechaNacimiento = this.fecha;
    console.log(JSON.stringify(form));

    const filepath = `choferes/${ form.folio}`;
    const fileRef = this._storage.ref(filepath);
    const task = this._storage.upload(filepath, this.fileImg);
    this.uploadProgress = task.percentageChanges();
    this.uploadProgress.subscribe(count => {
      this.counttimeUploading = count;
    });
    task.snapshotChanges().pipe(
      finalize(() => {
          this.uploadURL = fileRef.getDownloadURL()
          this.uploadURL.subscribe(urlPath => {
            form.img = urlPath;
            this.servicio.registarChofer(form).subscribe(data => {
              this.loading = false;
             this.respuesta = JSON.stringify(data);
             swal('Chofer registrado!', 'Continuar', 'success').then(()=>{
                this.counttimeUploading = 0;
               if(this.forma.value.concesiones_que_trabaja){
                 while(this.forma.value.concesiones_que_trabaja.length > 0){
                  for (let index = 0; index < this.forma.value.concesiones_que_trabaja.length; index++) {
                    this._removeConcesion_Vehiculos({indice: index});
                  }
                 }
                }

              if(this.forma.value.vehiculos_postureros){
                while (this.forma.value.vehiculos_postureros.length > 0){
                  for (let index = 0; index < this.forma.value.vehiculos_postureros.length; index++) {
                    this._removePostureros({indice: index});
                  }
                }
              }

               if(this.forma.value.concesion_socio){
                  this.forma.removeControl('concesion_socio');
                }

               this.VALIDATIONS_STEP1 = {
                'nombre':   false,
                'apellidos':   false,
                'correo':   false,
                'telefono':   false,
                'fechaNacimiento':   false,
                'img':   false,
              };
            
              this.VALIDATIONS_STEP2 = {
                'folio':   false,
                'etiqueta':   false,
                'concesion':   false,
              };
              this.imageSrc = null;

              this.forma.controls['folio'].setValue('');           
              this.forma.controls['nombre'].setValue('');          
              this.forma.controls['apellidos'].setValue('');       
              this.forma.controls['correo'].setValue('');          
              this.forma.controls['telefono'].setValue('');        
              this.forma.controls['etiqueta'].setValue('');        
              this.forma.controls['genero'].setValue('1');          
              this.forma.controls['fechaNacimiento'].setValue(''); 
              this.forma.controls['img'].setValue('');             
              this.forma.controls['activo'].setValue(false);
              this.forma.controls['autorizado'].setValue(true);
              this.forma.controls['uidUserSystem'].setValue(localStorage.getItem('uid'));   
              this._pushConcesion_Vehiculos('1');  
              this.finishReset.nativeElement.click();
              this.respuesta = '';
             })

           }, err=>{
            this.loading = false;
             if(JSON.parse(err._body).message === 'Error creating new user:  Error: The email address is already in use by another account.'){
              swal('Tenemos un problema', 'No es posible crear una cuenta con este correo por que ya existe en el sistema', 'error')
             } else {
              swal('Tenemos un problema', JSON.parse(err._body).message, 'error')
             }
           });
          });

      })).subscribe();
  }
  public finalizeReset(): void {
    this.resetCount += 1;
  }

  _pushConcesion_Vehiculos(modalidad:string) {
    const arrayControl = this.forma.get('concesiones_que_trabaja') as FormArray;
    if (arrayControl.length < 5) {
        this._pushConcesion();
        this._pushVehiculosFijo('***', modalidad);
        this.revisionStep2 = false;
        for (let index = 0; index < this.forma.value.concesiones_que_trabaja.length; index++) {
          const element = (this.forma.controls['concesiones_que_trabaja']['controls'][index]['controls']['placa'] as FormControl);
          element.statusChanges.subscribe(data => {
            if (data === 'INVALID') {
              this.revisionStep2 = false;
            }
          });
        }
    } else {
      this.error = 'Solo se puede asociar a un máximo de 3 concesiones';
    }
  }
  _removeConcesion_Vehiculos(indice: any) {
    this.concesiones_que_trabajaArray.removeAt(indice.indice);
    this.vehiculos_fijosArray.removeAt(indice.indice);
    if (this.forma.value.concesiones_que_trabaja.length < 5) this.error = '';
  }

  _removePostureros(indice: any){
    this.vehiculos_posturerosArray.removeAt(indice.indice);
  }

  _removeVehiculosFijos(indice) {
    this.vehiculos_fijosArray.removeAt(indice);
  }

  _removeVehiculosPostureros(indice) {
    this.vehiculos_posturerosArray.removeAt(indice);
  }

  _pushVehiculosFijo(concesion: any, modalidad:string) {
    this.vehiculos_fijosArray.push(this.createControlVehiculo(concesion, modalidad));
  }
  _pushVehiculosPosturero(concesion: any, modalidad:string) {
    this.vehiculos_posturerosArray.push(this.createControlVehiculo(concesion, modalidad));
  }



  createControlVehiculo(concesion: any, modalidad:string){
    return new FormGroup({
      'concesion': new FormControl(concesion),
      'marca':     new FormControl(null,  Validators.required),
      'modelo':    new FormControl(null,  Validators.required),
      'anio':      new FormControl(null,  Validators.required),
      'matricula': new FormControl(null,  Validators.required),
      'capacidad': new FormControl('-1',  Validators.required),
      'modalidad': new FormControl(modalidad,  Validators.required),
      'conRampa':  new FormControl(false, Validators.required),
      'nombreChoferRegistro': new FormControl(null),
      'fechaRegistro': new FormControl(null),
      'idVehiculo': new FormControl(null),
      'choferes': new FormControl(null),
      'vincularVehiculo': new FormControl(false)
    })
  }

   _pushConcesion() {
    const control = new FormGroup({
      'placa': new FormControl('***', [Validators.required, Validators.maxLength(3), Validators.max(765), Validators.min(1)])
    })
    this.concesiones_que_trabajaArray.push(control);

  }

  upload(event) {
    this.fileImg = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.fileImg);

  }
}
