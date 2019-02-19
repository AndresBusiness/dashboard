import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { ReadjsonService } from 'src/app/service/readjson.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
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
  infoTaxis: any [];
  settings: any;
  source: LocalDataSource;
  loading: boolean;

  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
              private servicejson: ReadjsonService) {
       this.loading = true;
       this._observarInfoTaxistas();
       this._observarUbicacionTaxistas();
  }

  ngOnInit() {
    this.settings = {
      actions: {
        title: 'Ver',
        add: false,
        edit: false,
        delete: false,
        custom: [
          {
            name: 'Ver',
            title: '<i class="icon-action-redo"></i>'
          }
        ],
        position: 'right',
      },
      defaultStyle: false,
      attr: {
      class: 'table table-hover table-bordered'
      },
      columns: {
        img: {
          title: 'Foto',
          filter: false,
          type: 'html',
          valuePrepareFunction: (img: string) => {
            return `<img width="50px" class="profile-pic" src="${img}" />`; },
        },
        uid: {
          title: '#',
          filter: false
        },
        nombre: {
          title: 'Nombre',
          filter: false,
        },
        correo: {
          title: 'Correo',
          filter: false
        },
        viajesHechos: {
          title: 'Viajes hechos',
          filter: false
        },
        telefono: {
          title: 'Teléfono',
          filter: false
        }
      }
    };

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
  onCustom(event) {
    console.log(event.data);
  }

  onUserRowSelect(event): void {
    console.log(event.data);
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
                 this.source = new LocalDataSource(this.infoTaxis);
                });
      this._observableSubscriptions.push(s);
  }

  private _observarInfoTaxistas() {
    const s = this.servicioFirebase.obtenerInfoTaxistas()
                .subscribe((infoSnapshot) => {
                  this.infoTaxis = [];
                  this.loading = false;
                  infoSnapshot.forEach((taxistaData: any) => {
                    const info = taxistaData.payload.doc.data();
                    info.uid = taxistaData.payload.doc.id;
                    this.infoTaxis.push(info);
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

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: query
      },
      {
        field: 'uid',
        search: query
      }
    ], false);
  }

  ngOnDestroy() {
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }


}
