import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';

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
  castor: string;
  lira: string;
  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService) {
    this.loading = true;
    this.castor = 'https://tvadikto.files.wordpress.com/2015/04/castor.png?w=50&h=50&crop=1';
    this.lira = 'https://i2.wp.com/www.thesnarkingdeadrecaps.com/wp-content/uploads/2017/08/OB-S5-E10-Cover.jpg?resize=50%2C50';

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
        genero: {
          title: 'Foto',
          filter: false,
          type: 'html',
          valuePrepareFunction: (genero: string) => {
            const img = genero === 'male' ? this.castor : this.lira;
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
          title: 'Estatus',
          filter: false,
          type: 'html',
          valuePrepareFunction: (activo: string) => {
            const activado = '<span class="label label-success">Activado</span>';
            const desactivado = '<span class="label label-danger">Desactivado</span>';
            return activo ? activado : desactivado;
        },
      }
      }
    };
  }

  onCustom(event) {
    console.log(event.data);
  }

  onUserRowSelect(event): void {
    console.log(event.data);
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

  public _observarInfoTaxistas() {
    const s = this.servicioFirebase.obtenerInfoChoferes()
                .subscribe((infoSnapshot) => {
                  this.infoChoferes = [];
                  this.loading = false;
                  infoSnapshot.forEach((taxistaData: any) => {
                    const info = taxistaData.payload.doc.data();
                    info.uid = taxistaData.payload.doc.id;
                    this.infoChoferes.push(info);
                  });
                  this.source = new LocalDataSource(this.infoChoferes);
                });
    setTimeout(() => {
      s.unsubscribe();
    }, 2000);
    // this._observableSubscriptions.push(s);
  }

}
