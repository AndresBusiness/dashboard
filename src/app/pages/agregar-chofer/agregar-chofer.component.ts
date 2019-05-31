import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';
import { FunctionsService } from 'src/app/service/functions.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { NgbDateCustomParserFormatter } from 'src/app/service/dateformat.service';

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

  @ViewChild('continuarStep2') continuarStep2: ElementRef;
  @ViewChild('continuarStep3') continuarStep3: ElementRef;

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
    private servicio: FunctionsService, private _storage: AngularFireStorage) {
    this.minDate = {year: 1950, month: 1, day: 1};
    this.maxDate = {year: 2001, month: 1, day: 1};
    this.startDate = {year: 1973, month: 6, day: 15};

    const uid = localStorage.getItem('uid');

    this.concesionesArray = this.fb.array([]);
    this.vehiculosArray = this.fb.array([]);


    this.forma = new FormGroup({
      'folio':           new FormControl('sfb', Validators.required),
      'nombre':          new FormControl('andres', Validators.required),
      'apellidos':       new FormControl('perez alonso', Validators.required),
      'correo':          new FormControl('andres@hotmail.com', [Validators.required, Validators.pattern(this.expRefEmail)]),
      'telefono':        new FormControl('4775673723', [Validators.required, Validators.minLength(10)]),
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
        this.forma.addControl('vehiculo_propio',new FormGroup({
          'concesion': new FormControl(revicion_Concesion),
          'marca':     new FormControl('Nissan',    Validators.required),
          'modelo':    new FormControl('Sentra',    Validators.required),
          'anio':      new FormControl('2019',    Validators.required),
          'matricula': new FormControl('212-24-TID',    Validators.required),
          'capacidad': new FormControl('4',  Validators.required),
          'modalidad': new FormControl('0',  Validators.required),
          'conRampa':  new FormControl(false, Validators.required),
          // 'choferes': this.choferesArray,
        }));
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
       })
       if (countErrrors > 0 && index === fieldStep2.length -1) {
         return
       }
      }
    }

      for (let index = 0; index < this.forma.value.concesiones_ayudantes.length; index++) {
        const placa = (this.forma.controls['concesiones_ayudantes']['controls'][index]['controls']['placa'] as FormControl);
        if (placa.value === '***') {
          placa.setErrors({required:true})
        }
        if (placa.errors) {
          if (placa.errors['required'] || placa.errors['max'] || placa.errors['min'] || placa.errors['maxLength'] || placa.errors['Mask error']) {
            countErrrors ++;
          }
        }
      }

      if (this.forma.controls['concesion_socio']) {
        const placa = (this.forma.controls['concesion_socio'] as FormControl)
        if (placa.value === '***') {
          placa.setErrors({required:true})
        }
        if (placa.errors) {
          if (placa.errors['required'] || placa.errors['max'] || placa.errors['min'] || placa.errors['maxLength'] || placa.errors['Mask error']) {
            countErrrors ++;
          }
        }

      }


      this.revisionStep2 = countErrrors > 0 ? false : true;
      if (this.revisionStep2) {
        this.continuarStep3.nativeElement.click();
      }


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
    this.respuesta = 'guardando';
    const form = this.forma.value;
    form.propietarioVehiculo = form.propietarioVehiculo ? '1':'-1';
    form.telefono = '+52' + form.telefono;
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
             this.forma.reset();
             this.respuesta = JSON.stringify(data);
           });
          });
  
      })).subscribe();
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
    this.vehiculosArray.push(new FormGroup({
      'concesion': new FormControl(concesion),
      'marca':     new FormControl('Nissan',    Validators.required),
      'modelo':    new FormControl('Sentra',    Validators.required),
      'anio':      new FormControl('2019',    Validators.required),
      'matricula': new FormControl('212-24-TID',    Validators.required),
      'capacidad': new FormControl('4',  Validators.required),
      'modalidad': new FormControl('0',  Validators.required),
      'conRampa':  new FormControl(false, Validators.required),
      // 'choferes': this.choferesArray,
    }));
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
