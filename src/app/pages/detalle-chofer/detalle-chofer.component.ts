import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { FunctionsService } from 'src/app/service/functions.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-detalle-chofer',
  templateUrl: './detalle-chofer.component.html',
  styleUrls: ['./detalle-chofer.component.css']
})
export class DetalleChoferComponent implements OnInit {

  public doughnutChartLabels: any[] = ['Aceptados', 'Rechazados', 'Perdidos'];
  public doughnutChartData: any = [350, 450, 100];
  public doughnutChartType: ChartType = 'doughnut';

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

  imgDefault: string;
  listComentarios: any[] = [];
  colorIcon: string[] = ['#ef5350', '#DC7633', '#398bf7', '#F1C40F', '#27AE60'];

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
  }

  ngOnInit() {
  }

  obtenerInfoChofer(uid: string) {
    this.servicioFirebase.buscarInfoChofer(uid)
        .then(data => {
          this.chofer = data;
          this.habilitado = this.chofer.autorizado;
          this.correo = this.chofer.correo;
          this.servicioFirebase.buscarInfoVehiculoRegistroChofer(this.chofer.nombre + ' ' + this.chofer.apellidos)
          .subscribe((data: any)=>{
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              let vehiculares = {
                'vehiculo': element
              }
              this.vehiculosRegistrados.push(vehiculares)
            }
          })
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
    }
    this.servicioNode.reestablecerPassword(obj).subscribe(data=>{
      this.loading = false;
      if(data){
        swal('Correcto!', 'Se ha reestablecido la contraseña correctamente', 'success')
      }
    });
  }

}
