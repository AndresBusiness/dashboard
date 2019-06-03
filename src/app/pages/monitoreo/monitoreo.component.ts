import { ModalChoferComponent } from './../../shared/modal-chofer/modal-chofer.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { ReadjsonService } from 'src/app/service/readjson.service';
import swal from 'sweetalert';
import 'rxjs/add/observable/of';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {

  lat = 20.5024843;
  lng = -86.9467869;
  taxistas: any[];
  busqueda: any[];
  locaciones: any[];
  rol: string;
  zoom: number = 14;
  concesion:any;

  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
              private servicejson: ReadjsonService,
              private modalService: NgbModal) {
    this._observarUbicacionUnidades();
    this.rol = 'Selecciona el rol';
  }

  ngOnInit() {
    this.zoom = 14;
    this.obtenerRoles();
    // this._agregarItem();
  }

  private _agregarItem() {
    const list: any[] = [];
    this.servicejson.obtenerItemJsonConcesion()
    .subscribe(informacion => {
      for (let i = 0; i < 53; i++) {

        this.servicioFirebase.agregarItem(
          (informacion[i].unidad).toString(),
           informacion[i])
        .then(() => {
        });
      }
    });
  }

  public _observarUbicacionUnidades() {
    const s = this.servicioFirebase.obtenerConcesiones()
                .subscribe((taxistasSnapshot) => {
                  this.taxistas = [];
                  taxistasSnapshot.forEach((taxistaData: any) => {
                    const info = taxistaData.payload.doc;
                    let img = this._addIconMarquer(info.data());
                    this.taxistas.push({
                      id: info.id,
                      data: info.data(),
                      img: img
                    });
                  });
                });
    this._observableSubscriptions.push(s);

  }

  public obtenerRoles() {
    const listLocaciones = JSON.parse(localStorage.getItem('ROLES'));
    if (listLocaciones != null) {
        this.locaciones = listLocaciones;
    } else {
        this.servicioFirebase.obtenerRolles().subscribe((locacionSnapshot) => {
        this.locaciones = [];
        locacionSnapshot.forEach((locacionData: any) => {
          this.locaciones.push({
            id: locacionData.payload.doc.id,
            data: locacionData.payload.doc.data(),
          });
        });
        localStorage.setItem('ROLES', JSON.stringify(this.locaciones));
      });
    }
  }

  obtenerInfoChofer(info: any) {
    const chofer = info;
    this.servicioFirebase.buscarInfoChofer(info.chofer)
        .then(data => {
          chofer.correo = data.correo;
          chofer.nombre = data.nombre;
          chofer.img = data.img;
          chofer.telefono = data.telefono;
          chofer.registrado = data.registrado;
          chofer.choferActivo = data.activo;
          chofer.genero = data.genero;
          const modalRef = this.modalService.open(ModalChoferComponent);
          modalRef.componentInstance.chofer = chofer;
        });
  }

  onSearch(unidad: any ) {
     this.servicioFirebase.buscarConcesion(unidad)
      .subscribe((data: any) => {
        if (data) {
          this.taxistas = [];
          this.rol = 'Selecciona el rol';
          let img = this._addIconMarquer(data);
          this.taxistas.push({
            id: data.unidad,
            data: data,
            img: img
          });
          this.lat = data.geoposition._lat;
          this.lng = data.geoposition._long;
          this.zoom = 19;
        } else {
          swal('Sin datos!', `No hay unidades con número de concesión ${unidad}`, 'warning');
        }
      });
  }

  onChange($event) {
    this.concesion = '';
    if (this.rol === 'Todos' || this.rol === 'Selecciona el rol') {
      this.lat = 20.5024843;
      this.lng = -86.9467869;
      this.zoom = 15;
      this._observarUbicacionUnidades();
    } else {
      const s = this.servicioFirebase.filtrarConcesiones(this.rol)
      .subscribe((taxistasSnapshot) => {
        this.taxistas = [];
        taxistasSnapshot.forEach((taxistaData: any) => {
          const info = taxistaData.payload.doc;
          let img = this._addIconMarquer(info.data());
          this.taxistas.push({
            id: info.id,
            data: info.data(),
            img: img
          });
        });
        if (this.taxistas.length === 0) {
          swal('Sin datos!', 'No hay unidades con este rol', 'warning');
        } else {
          if (this.rol === 'Libre' || this.rol === 'SemiLibre') {
            this.zoom = 11;
            this.lat =  20.4492543;
            this.lng =  -86.9566575;
          } else {
            this.zoom = 18;
            this.lat =  this.taxistas[0].data.geoposition._lat;
            this.lng =  this.taxistas[0].data.geoposition._long;
          }
        }
      });
      this._observableSubscriptions.push(s);
    }
  }

  _addIconMarquer(data: any) {
  let img = '';
  if (data.descripcionUbicacion === 'Libre') {
    if (data.llevaPasaje !== 'no') {
      img = '../../../assets/images/pin/Taxi-libre-ocupado.png';
    } else {
      img = '../../../assets/images/pin/Taxi-libre.png';
    }
  } else if (data.descripcionUbicacion === 'SemiLibre') {
    if (data.llevaPasaje !== 'no') {
      img = '../../../assets/images/pin/Taxi-Semilibre-ocupado.png';
    } else {
      img = '../../../assets/images/pin/Taxi-Semilibre.png';
    }
  } else {
    if (data.llevaPasaje !== 'no') {
      img = '../../../assets/images/pin/Taxi-turno-ocupado.png';
    } else {
      img = '../../../assets/images/pin/Taxi-turno.png';
    }
  }
  return img;
}

  ngOnDestroy() {
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }


}
