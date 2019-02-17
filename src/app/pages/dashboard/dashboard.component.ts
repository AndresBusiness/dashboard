import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { Field } from 'ng2-jsgrid/interfaces/field.interface';
import { ReadjsonService } from 'src/app/service/readjson.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  lat = 20.5086946;
  lng = -86.944684;
  taxistas: any[];
  infoTaxis: any [];
  fields: Field[];
  api: any;

  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
              private servicejson: ReadjsonService) {
      // this._observarInfoTaxistas();
      // this._observarUbicacionTaxistas();
  }

  ngOnInit() {
    this.fields = [
      { name: 'img', title: 'Foto' },
      { name: 'uid', title: '#' },
      { name: 'nombre', title: 'Nombre' },
      { name: 'correo', title: 'Correo' },
      { name: 'viajesHechos', title: 'Viajes hechos' },
      { name: 'placas', title: 'Placa' },
      { name: 'telefono', title: 'Teléfono' },
    ];
    // this._agregarInfoTaxistasFake();
    // this._agregarUbicacionTaxistasFake();
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
      console.log(informacion.length);
      for (let i = 0; i < informacion.length; i++) {
        console.log(informacion[i]);
        this.servicioFirebase.agregarUbicacionTaxistasFake
         (informacion[i], informacion[i].uid);
      }
    });
  }

  private _observarUbicacionTaxistas() {
    const s = this.servicioFirebase.obtenerUbicacionTaxistas()
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

  private _observarInfoTaxistas() {
    const s = this.servicioFirebase.obtenerInfoTaxistas()
                .subscribe((infoSnapshot) => {
                  this.infoTaxis = [];
                  infoSnapshot.forEach((taxistaData: any) => {
                    const info = taxistaData.payload.doc.data();
                    info.uid = taxistaData.payload.doc.id;
                    this.infoTaxis.push(info);
                  });
                  this.api = async (filter) => {
                    return {
                      data: this.infoTaxis
                    };
                  };
                });
    this._observableSubscriptions.push(s);
  }

  obtenerInfoTaxi(uid: string) {
    this.servicioFirebase.buscarInfoTaxistas(uid)
        .then(data => {
          console.log(data);
        });
  }

  ngOnDestroy() {
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }


}
