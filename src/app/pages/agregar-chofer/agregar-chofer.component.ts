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
  public concesionesArray: FormArray;
  public vehiculosArray: FormArray;
  public choferesArray: FormArray;
  horalocal: string =  moment().locale('es').format('MMMM Do YYYY, h:mm:ss a');

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
  tieneConcesion: boolean = false;
  tieneVehiculo: boolean = false;
  public loading = false;

  @ViewChild('continuarStep2') continuarStep2: ElementRef;
  @ViewChild('continuarStep3') continuarStep3: ElementRef;
  @ViewChild('finishReset') finishReset: ElementRef;

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

    this.concesionesArray = this.fb.array([]);
    this.vehiculosArray = this.fb.array([]);


    this.forma = new FormGroup({
      'folio':           new FormControl('', Validators.required),
      'nombre':          new FormControl('', Validators.required),
      'apellidos':       new FormControl('', Validators.required),
      'correo':          new FormControl('', [Validators.required, Validators.pattern(this.expRefEmail)]),
      'telefono':        new FormControl('', [Validators.required, Validators.minLength(10)]),
      'etiqueta':        new FormControl('', Validators.required),
      'genero':          new FormControl('1', Validators.required),
      'fechaNacimiento': new FormControl('', [Validators.required, this.validarFecha]),
      'img':             new FormControl('', Validators.required),
      'propietarioVehiculo':  new FormControl(false, Validators.required),
      'activo':               new FormControl(false, Validators.required),
      'autorizado':           new FormControl(false, Validators.required),
      'uidUserSystem':        new FormControl(uid, Validators.required),
      'concesiones_ayudantes': this.concesionesArray,
      'vehiculos_ayudantes':   this.vehiculosArray
    });

    this.forma.controls['etiqueta'].valueChanges
    .subscribe(dataEtiqueta => {
      if (dataEtiqueta === '1' || dataEtiqueta ===  true) {
        this.tieneConcesion = true;
        this.forma.addControl('concesion_socio',
        new FormControl('***', [Validators.required, Validators.maxLength(3), Validators.max(765), Validators.min(1)]));
        this.forma.controls['concesion_socio'].valueChanges.subscribe(dataConcesionSocio => {
          if (this.tieneVehiculo && dataEtiqueta === '1') {
            this.forma.controls['vehiculo_propio']['controls']['concesion'].setValue(dataConcesionSocio);
          }
        });
      } else {
        this.tieneConcesion = false;
        if (this.tieneVehiculo && dataEtiqueta === '0') {
          this.forma.controls['vehiculo_propio']['controls']['concesion'].setValue('***');
        }
        this.forma.removeControl('concesion_socio');
      }
    });


    this.forma.controls['propietarioVehiculo'].valueChanges
    .subscribe(data => {
      if (data === 1 || data === true) {
        let revicion_Concesion = '***';
        if (this.forma.value.concesion_socio) {
          revicion_Concesion = this.forma.value.concesion_socio;
        }
        this.forma.addControl('vehiculo_propio',this.createControlVehiculo(revicion_Concesion));
        this.tieneVehiculo = true;
      } else {
        this.tieneVehiculo = false;
        this.forma.removeControl('vehiculo_propio');
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
  }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    // Force another change detection in order to fix an occuring ExpressionChangedAfterItHasBeenCheckedError
    this._changeDetectionRef.detectChanges();

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

    for (let index = 0; index < this.forma.value.concesiones_ayudantes.length; index++) {
        const placa = (this.forma.controls['concesiones_ayudantes']['controls'][index]['controls']['placa'] as FormControl);
        if (placa.value === '***') {
          placa.setErrors({required: true});
        }
        if (placa.errors) {
          if (placa.errors['required'] || placa.errors['max'] || placa.errors['min']
          || placa.errors['maxLength'] || placa.errors['Mask error']) {
            countErrrors ++;
          }
        }  else {
          this._consultarVehiculo(placa.value.toString(), this.forma.controls['vehiculos_ayudantes']['controls'][index]['controls']);
        }
    }

    if (this.forma.controls['concesion_socio']) {
      const placa = (this.forma.controls['concesion_socio'] as FormControl)
      if (placa.value === '***') {
        placa.setErrors({required: true});
      }
      if (placa.errors) {
        if (placa.errors['required'] || placa.errors['max'] || placa.errors['min']
        || placa.errors['maxLength'] || placa.errors['Mask error']) {
          countErrrors ++;
        }
      } else {
        if(this.tieneVehiculo){
          this._consultarVehiculo(placa.value.toString(), this.forma.controls['vehiculo_propio']['controls']);
        }
      }
    }
    this.revisionStep2 = countErrrors > 0 ? false : true;
    if (this.revisionStep2) {
      this.continuarStep3.nativeElement.click();
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
      } else {
        control['modelo'].setValue(null);
        control['marca'].setValue(null);
        control['anio'].setValue(null);
        control['matricula'].setValue(null);
        control['modalidad'].setValue('-1');
        control['capacidad'].setValue('-1');
        control['conRampa'].setValue(false);
        control['nombreChoferRegistro'].setValue(null);
        control['fechaRegistro'].setValue(null);
        control['choferes'].setValue(null);
        control['idVehiculo'].setValue(null);

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
               if(this.forma.value.concesiones_ayudantes){
                   for (let index = 0; index < this.forma.value.concesiones_ayudantes.length; index++) {
                     this._removeConcesion_Vehiculos({indice: index});
                   }
                 }
               

               if(this.forma.value.concesion_socio){
                  this.forma.removeControl('concesion_socio');
                }
               if(this.forma.value.vehiculo_propio){
                 this.forma.removeControl('vehiculo_propio');
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
              this.forma.controls['propietarioVehiculo'].setValue(false);
              this.forma.controls['activo'].setValue(false);
              this.forma.controls['autorizado'].setValue(false);
              this.forma.controls['uidUserSystem'].setValue(localStorage.getItem('uid'));     
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

  _pushConcesion_Vehiculos() {
    const arrayControl = this.forma.get('concesiones_ayudantes') as FormArray;
    if (arrayControl.length < 3) {
        this._pushConcesion();
        this._pushVehiculos('***');
        this.revisionStep2 = false;
        for (let index = 0; index < this.forma.value.concesiones_ayudantes.length; index++) {
          const element = (this.forma.controls['concesiones_ayudantes']['controls'][index]['controls']['placa'] as FormControl);
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
  _removeConcesion_Vehiculos(event: any) {
    this.concesionesArray.removeAt(event.indice);
    this.vehiculosArray.removeAt(event.indice);
    if (this.forma.value.concesiones_ayudantes.length < 3) this.error = '';
  }

  _removeVehiculos(indice) {
    this.vehiculosArray.removeAt(indice);
  }

  _pushVehiculos(concesion: any) {
    this.vehiculosArray.push(this.createControlVehiculo(concesion));
  }

  createControlVehiculo(concesion: any){
    return new FormGroup({
      'concesion': new FormControl(concesion),
      'marca':     new FormControl(null,  Validators.required),
      'modelo':    new FormControl(null,  Validators.required),
      'anio':      new FormControl(null,  Validators.required),
      'matricula': new FormControl(null,  Validators.required),
      'capacidad': new FormControl('-1',  Validators.required),
      'modalidad': new FormControl('-1',  Validators.required),
      'conRampa':  new FormControl(false, Validators.required),
      'nombreChoferRegistro': new FormControl(null),
      'fechaRegistro': new FormControl(null),
      'idVehiculo': new FormControl(null),
      'choferes': new FormControl(null),
      'vincularVehiculo': new FormControl(false),
      
    })
  }

   _pushConcesion() {
    const control = new FormGroup({
      'placa': new FormControl('***', [Validators.required, Validators.maxLength(3), Validators.max(765), Validators.min(1)])
    })
    this.concesionesArray.push(control);

  }

  upload(event) {
    this.fileImg = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.fileImg);

  }
}
