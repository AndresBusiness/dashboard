import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-chofer',
  templateUrl: './detalle-chofer.component.html',
  styleUrls: ['./detalle-chofer.component.css']
})
export class DetalleChoferComponent implements OnInit {

  user = {
    'uid': '',
    'correo': '',
    'nombre': '',
    'img': '',
    'telefono': '',
    'registrado': '',
    'choferActivo': '',
    'unidad': null,
  };

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
          this.user.correo       = data.correo;
          this.user.nombre       = data.nombre;
          this.user.img          = data.img;
          this.user.telefono     = data.telefono;
          this.user.registrado   = data.fechaRegistro;
          this.user.choferActivo = data.activo;
          this.user.unidad       = data.concesion;
          this.servicioFirebase.buscarInfoUnidad(this.user.correo)
          .subscribe((data: any) => {
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
