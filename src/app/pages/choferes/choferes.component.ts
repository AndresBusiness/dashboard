import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choferes',
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.css']
})
export class ChoferesComponent implements OnInit {

  source: LocalDataSource;
  settings: any;
  loading: boolean;
  infoChoferes: any [];
  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
    public router: Router) {
    this.loading = true;
    this._observarInfoTaxistas();
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
            return `<img  width="50" height="50" class="profile-pic" src="${img}" />`; },
        },
        nombre: {
          title: 'Nombre',
          filter: false,
        },
        correo: {
          title: 'Correo',
          filter: false
        },
        telefono: {
          title: 'Teléfono',
          filter: false
        },
        activo: {
          title: 'Conectado',
          filter: false,
          type: 'html',
          valuePrepareFunction: (activo: string) => {
            const activado = '<span class="custom-badge label label-success">ONLINE</span>';
            const desactivado = '<span class="custom-badge label label-danger">OFFLINE</span>';
            return activo ? activado : desactivado;
        },
      }
      }
    };
  }


  onUserRowSelect(event): void {
    const path = `/detalle-choferes/${event.data.uid}`;
    this.router.navigate([path]);
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'nombre',
        search: query
      },
      {
        field: 'concesion',
        search: query
      }
    ], false);
  }

  public _observarInfoTaxistas() {
     this.servicioFirebase.obtenerInfoChoferes()
            .subscribe((infoSnapshot) => {
              console.log('estoy leyendo cam')
              this.infoChoferes = [];
              this.loading = false;
              infoSnapshot.forEach((taxistaData: any) => {
                this.infoChoferes.push(taxistaData);
              });
              this.source = new LocalDataSource(this.infoChoferes);
            });
  }

  abrirAgregarChofer() {
    this.router.navigate(['/agregar-chofer']);
  }

}
