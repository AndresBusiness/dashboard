import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-detalle-chofer',
  templateUrl: './detalle-chofer.component.html',
  styleUrls: ['./detalle-chofer.component.css']
})
export class DetalleChoferComponent implements OnInit {

  public doughnutChartLabels: any[] = ['Aceptados', 'Rechazados', 'Perdidos'];
  public doughnutChartData: any = [350, 450, 100];
  public doughnutChartType: ChartType = 'doughnut';

  user = {
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
  vehiculosRegistrados: any [] = [];

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
    private servicioFirebase: FirebaseService) {
    this.imgDefault = 'https://firebasestorage.googleapis.com/v0/b/directtaxi-prod.appspot.com/' +
    'o/imgDefault.png?alt=media&token=e65da24c-3355-4327-8e4f-d9c177564f47';
    this.user.uid = this.route.snapshot.paramMap.get('uid');
    this.obtenerInfoChofer(this.user.uid);
  }

  ngOnInit() {
  }

  obtenerInfoChofer(uid: string) {
    this.servicioFirebase.buscarInfoChofer(uid)
        .then(data => {
          this.user = data;
          this.servicioFirebase.buscarInfoVehiculoRegistroChofer(this.user.nombre + ' ' + this.user.apellidos)
          .subscribe((data: any)=>{
            
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              let vehiculares = {
                'vehiculo': element,
                'chofer': null,
              }
              this.servicioFirebase.buscarInfoChofer(element.propietario)
              .then(chofer=>{
                vehiculares.chofer = chofer;
                this.vehiculosRegistrados.push(vehiculares)
                console.log(vehiculares);
              });
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

}
