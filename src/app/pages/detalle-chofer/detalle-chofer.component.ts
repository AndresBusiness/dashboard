import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { FunctionsService } from 'src/app/service/functions.service';
import swal from 'sweetalert';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-chofer',
  templateUrl: './detalle-chofer.component.html',
  styleUrls: ['./detalle-chofer.component.css']
})
export class DetalleChoferComponent implements OnInit {

  public doughnutChartLabels: any[] = ['Aceptados', 'Rechazados', 'Perdidos', 'Cancelado por el pasajero', 'Cancelado por el chofer'];
  public doughnutChartData: any = [550, 150, 100, 10, 12];
  public doughnutChartType: ChartType = 'doughnut';
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  cargandoimagen: boolean = true; 
  public forma:FormGroup;
  vehiculoSeleccionado: boolean = false;

  chofer = {
    "activo": false,
    "apellidos": "",
    "autorizado": false,
    "concesion": "",
    "concesiones_que_trabaja": [],
    "correo": "",
    "etiqueta": "",
    "fechaNacimiento": "",
    "fechaRegistro": "",
    "folio": "",
    "genero": "",
    "img": "",
    "nombre": "",
    "propietarioVehiculo": "",
    "telefono": "",
    "uid": "",
    "uidUserSystem": "",
  };
  user: any;
  uid:string;
  vehiculosRegistrados: any [] = [];
  correo: string;
  habilitado: boolean ;
  public loading = false;
  calificaciones = {
    'excelente': 3713,
    'muybueno': 742,
    'bueno': 247,
    'malo': 148,
    'pesimo':99
  }

  imgDefault: string;
  listComentarios: any[] = [];
  colorIcon: string[] = ['#ef5350', '#DC7633', '#398bf7', '#ffb22b', '#06d79c'];

  icons: string[] =
  ['mdi mdi-emoticon-sad',
   'mdi mdi-emoticon-neutral',
   'mdi mdi-emoticon-happy',
   'mdi mdi-emoticon',
   'mdi mdi-emoticon-cool'];

  rating: string[] = ['Pésimo', 'Malo', 'Normal', 'Muy bueno', 'Excelente'];
  constructor(private route: ActivatedRoute,
    private servicioNode: FunctionsService,
    private servicioFirebase: FirebaseService) {
    this.imgDefault = 'https://firebasestorage.googleapis.com/v0/b/directtaxi-prod.appspot.com/' +
    'o/imgDefault.png?alt=media&token=e65da24c-3355-4327-8e4f-d9c177564f47';
    this.chofer.uid = this.route.snapshot.paramMap.get('uid');
    this.user=  JSON.parse(localStorage.getItem('user'));
    this.uid = localStorage.getItem('uid');
    this.obtenerInfoChofer(this.chofer.uid);

    this.forma = new FormGroup({
      'idVehiculo':         new FormControl('', Validators.required),
      'marca':           new FormControl('', Validators.required),
      'modelo':          new FormControl('', Validators.required),
      'matricula':          new FormControl('', Validators.required),
      'anio':          new FormControl('', Validators.required),
      'capacidad':          new FormControl('-1', Validators.required),
      'conRampa':          new FormControl('', Validators.required),
      // 'modalidad':          new FormControl('-1', Validators.required)
      // 'concesion':          new FormControl('', Validators.required),
    });
    
  }

  ngOnInit() {
  }

  obtenerInfoChofer(uid: string) {
    this.servicioFirebase.buscarInfoChofer(uid)
        .then(data => {
          this.chofer = data;
          setTimeout(() => {
            this.cargandoimagen = false;            
          }, 500);
          this.habilitado = this.chofer.autorizado;
          this.correo = this.chofer.correo;
          this.obtenerVehiculos(this.chofer.uid);
        });

    this.servicioFirebase.buscarComentariosChoferes(uid)
        .subscribe((data: any) => {
          this.listComentarios = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].comentario !== '') {
              data[i].emoji = {
                icon: this.icons[data[i].calificacion - 1 ],
                class: this.colorIcon[data[i].calificacion - 1 ],
                rating : this.rating[data[i].calificacion - 1 ],
              }
              data[i].imgPasajero =  data[i].imgPasajero === 'sin imagen' ? this.imgDefault : data[i].imgPasajero;
              this.listComentarios.push(data[i]);
            }
          }
        });
  }

  obtenerVehiculos(idChofer: string){
    this.servicioFirebase.buscarInfoVehiculoFijosChofer(idChofer)
    .subscribe((vehiculos: any)=>{
      this.vehiculosRegistrados = [];
      vehiculos.forEach(vehiculo => {
        this.vehiculosRegistrados.push(vehiculo);
      });
    });
    this.servicioFirebase.buscarInfoVehiculoPostureroChofer(idChofer)
    .subscribe(vehiculos=>{
      vehiculos.forEach(vehiculo => {
        this.vehiculosRegistrados.push(vehiculo)
      });
    })
  }

  cambiarStatusChofer(){
    this.habilitado = !this.habilitado;
    this.loading = true;
    const obj = {
      'uid': this.chofer.uid,
      'disabled': this.chofer.autorizado,
      'correo': this.chofer.correo,
      "uidUserSystem":this.user.nombre ,
      "nombreUserSystem": this.user.nombre,
      "imgUserSystem": this.user.img
    }

    this.servicioNode.cambiarEstatusChofer(obj).subscribe(data=>{
      this.loading = false;
      if(data){
        const mensaje =  this.chofer.autorizado? 'deshabilitado': 'habilitado';
        swal('Correcto!', 'Se ha ' +mensaje+  ' el chofer correctamente', 'success')
        .then(()=>{
          this.chofer.autorizado = this.habilitado;
          if(!this.habilitado){
            this.chofer.activo = false;
          }
        })
      }
    });
  }

  reestablecerPassword(){
    this.loading = true;
    const obj = {
      'uidChofer': this.chofer.uid,
      'uidUserSystem': this.uid,
      'nombre':this.user.nombre ,
      'img': this.user.img,
      'correo': this.correo,
      'dataChofer': this.chofer, 
      'dataVehiculos': this.vehiculosRegistrados
    }
    this.servicioNode.reestablecerPassword(obj).subscribe(data=>{
      this.loading = false;
      if(data){
        swal('Correcto!', 'Se ha reenviado la información de registro nuevamente', 'success')
      }
    });
  }

  editarChofer(){
    this.loading = true;
    const dataChofer = {
      uid: this.chofer.uid,
      nombre: this.chofer.nombre,
      apellidos: this.chofer.apellidos,
      telefono: this.chofer.telefono,
      correo: this.chofer.correo,
      folio: this.chofer.folio,
      genero: this.chofer.genero,
      'uidUserSystem': this.uid,
      'nombreSystem':this.user.nombre ,
      'imgSystem': this.user.img,
    }
    this.servicioNode.editarChofer(dataChofer).subscribe((data: any)=>{
      this.loading = false;
      if(data.commit){
        swal('Correcto!', 'Información modificada correctamente', 'success')
      }
    });
  }

  seleccionVehiculo(item){
    this.vehiculoSeleccionado = true;
    this.forma.controls['idVehiculo'].setValue(item.idVehiculo);
    this.forma.controls['marca'].setValue(item.marca);
    this.forma.controls['modelo'].setValue(item.modelo);
    this.forma.controls['anio'].setValue(item.anio);
    this.forma.controls['capacidad'].setValue(item.capacidad);
    // this.forma.controls['modalidad'].setValue(item.modalidad);
    this.forma.controls['matricula'].setValue(item.matricula);
    this.forma.controls['conRampa'].setValue(item.conRampa);
  }
  editarVehiculo(){
    console.log(this.forma.value);
    this.loading = true;
    const dataVehiculo = {
      idVehiculo: this.forma.value.idVehiculo,
      marca: this.forma.value.marca,
      modelo: this.forma.value.modelo,
      anio: this.forma.value.anio,
      capacidad: this.forma.value.capacidad,
      matricula: this.forma.value.matricula,
      conRampa: this.forma.value.conRampa,
      'uidUserSystem': this.uid,
      'nombreSystem':this.user.nombre ,
      'imgSystem': this.user.img,
    }

    this.servicioNode.editarVehiculo(dataVehiculo).subscribe((data: any)=>{
      this.loading = false;
      this.forma.reset();
      this.vehiculoSeleccionado = false;
      if(data.commit){
        swal('Correcto!', 'Información modificada correctamente', 'success')
      }
    });

  }

}