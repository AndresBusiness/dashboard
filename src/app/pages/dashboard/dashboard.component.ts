import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { ReadjsonService } from 'src/app/service/readjson.service';

import 'rxjs/add/observable/of';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  lat = 20.5024843;
  lng = -86.9467869;
  taxistas: any[];
  busqueda: any[];
  enTurno: string;
  zoom: number;

  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
              private servicejson: ReadjsonService) {
    this._observarUbicacionUnidades();
    this.zoom = 15;
    this.enTurno = 'Todos';
    // this._observarInfoTaxistas();
  }

  ngOnInit() {
    // this._agregarInfoTaxistasFake();
    // this._agregarUbicacionTaxistasFake();
    // this._agregarUbicacionUnidades();
  }

  private _agregarInfoTaxistasFake() {
    this.servicejson.obtenerInfoTaxistas()
    .subscribe(informacion => {
      for (let i = 0; i < informacion.length; i++) {
        this.servicioFirebase.agregarInfoTaxistasFake(informacion[i], i);
      }
    });
  }


  private _agregarUbicacionTaxistasFake() {
    this.servicejson.obtenerGeopositionTaxistas()
    .subscribe(informacion => {
      for (let i = 0; i < informacion.length; i++) {
        this.servicioFirebase.agregarUbicacionTaxistasFake
         (informacion[i], informacion[i].uid);
      }
    });
  }

  private _agregarUbicacionUnidades() {
    this.servicejson.obtenerGeopositionUnidades()
    .subscribe(informacion => {
      console.log(informacion.length);
      for (let i = 0; i < informacion.length; i++) {
        console.log(informacion[i]);
         this.servicioFirebase.agregarUbicacionUnidades
          (informacion[i], informacion[i].unidad);
      }
    });
  }

  public _observarUbicacionUnidades() {
    const s = this.servicioFirebase.obtenerUbicacionUnidades()
                .subscribe((taxistasSnapshot) => {
                  this.taxistas = [];
                  taxistasSnapshot.forEach((taxistaData: any) => {
                    this.taxistas.push({
                      id: taxistaData.payload.doc.id,
                      data: taxistaData.payload.doc.data(),
                    });
                  });
                });
      this._observableSubscriptions.push(s);
  }

  obtenerInfoTaxi(uid: string) {
    this.servicioFirebase.buscarInfoTaxistas(uid)
        .then(data => {
          console.log(data);
        });
  }

  onSearch(unidad: any ) {
     this.servicioFirebase.buscarUnidad(unidad)
      .then(data => {
        console.log(data);
        this.taxistas = [];
        this.taxistas.push({
          id: data.unidad,
          data: data,
        });
        this.lat = data.geoposition._lat;
        this.lng = data.geoposition._long;
        this.zoom = 18;
      });
  }

  onChange($event) {
    const s = this.servicioFirebase.filtrarUnidades(this.enTurno)
                .subscribe((taxistasSnapshot) => {
                  this.taxistas = [];
                  taxistasSnapshot.forEach((taxistaData: any) => {
                    this.taxistas.push({
                      id: taxistaData.payload.doc.id,
                      data: taxistaData.payload.doc.data(),
                    });
                  });
                  this.zoom = 18;
                  this.lat =  this.taxistas[0].data.geoposition._lat;
                  this.lng =  this.taxistas[0].data.geoposition._long;
                });
      this._observableSubscriptions.push(s);
}

  ngOnDestroy() {
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }


}
