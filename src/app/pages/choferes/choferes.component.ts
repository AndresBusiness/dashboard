import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CustomCellFotoComponent } from './custom-cell/custom-cell-foto/custom-cell-foto.component';
import { CustomCellTipoComponent } from './custom-cell/custom-cell-tipo/custom-cell-tipo.component';

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
  countAyudantes: number = 0;
  countSocios: number = 0;
  countConectados: number = 0;
  countTotal: number= 0;
  parametroBusqueda: string;


  private _observableSubscriptions: Subscription[] = [];
  constructor(private servicioFirebase: FirebaseService,
    public router: Router) {
    this.loading = true;
    this._observarInfoTaxistas();
  }

  ngOnInit() {
    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false
      },
      defaultStyle: false,
      attr: {
        class: 'table table-striped table-hover table-responsive-lg table-responsive-md table-responsive-sm'
      },
      pager: {
        display: true,
        perPage: 10
      },
      columns: {
        img: {
          title: 'Foto',
          filter: false,
          type: 'custom',
          renderComponent: CustomCellFotoComponent
        },
        folio: {
          title: 'Folio',
          filter: true
        },
        nombre: {
          title: 'Nombre',
          filter: true,
        },
        apellidos: {
          title: 'Apellidos',
          filter: true,
        },
        correo: {
          title: 'Correo',
          filter: true,
        },
        telefono: {
          title: 'Teléfono',
          filter: true,
        },
        etiqueta: {
          title: 'Tipo',
          filter: {
            type: 'custom',
            component: CustomCellTipoComponent,
          },
          type: 'html',
          valuePrepareFunction: (etiqueta: any) => {
            const socio = '<div class="custom-badge span-chofer span-socio">Socio</div>';
            const ayudante = '<div class="custom-badge span-chofer span-ayudante">Ayudante</div>';
            return etiqueta === '1' ? socio : ayudante;
          },
        },
        // activo: {
        //     title: 'Conectado',
        //     filter: false,
        //     type: 'html',
        //     valuePrepareFunction: (activo: string) => {
        //       const activado = '<span class="custom-badge label label-success" style="width: 115px;">Online</span>';
        //       const desactivado = '<span class="custom-badge label label-danger" style="width: 115px;">Offline</span>';
        //       return activo ? activado : desactivado;
        //   },
        // },
        concesiones_que_trabaja: {
            title: 'Concesiones',
            filter: false,
            type: 'html',
            valuePrepareFunction: (arreglo: any) => {
              let data = '';
              arreglo.forEach(element => {
                data+= '<span class="custom-badge span-conseciones">'+ element.placa +'</span>';
              });
              return data;
          },
       }

      }
    };
  }


  onUserRowSelect(event): void {
    const path = `/detalle-choferes/${event.data.uid}`;
    this.router.navigate([path]);
  }

  onSearch(event: any) {
    console.log(this.parametroBusqueda);
    if(this.parametroBusqueda){
      if(this.isNumber(this.parametroBusqueda)){
        let list = [];
        this.infoChoferes.forEach(element => {
          if(this.parametroBusqueda === element.concesion ){
            list.push(element);
          }
          element.concesiones_que_trabaja.forEach(concesion => {
            if(this.parametroBusqueda === concesion.placa){
              let existe = false;
              list.forEach(buscar => {
                if(concesion.placa === buscar.concesion){
                  existe = true;
                }
              });
              if(!existe){
               list.push(element);                
              }
            }
          });
        });
        this.source = new LocalDataSource(list);
      } 
      // else{
      //     if(this.parametroBusqueda === 'socio' || this.parametroBusqueda === 'ayudante'){
      //       let list = [];
      //       let etiqueta = this.parametroBusqueda === 'socio' ? '1':'0';
      //       this.infoChoferes.forEach(element => {
      //         if(etiqueta === element.etiqueta ){
      //           list.push(element);
      //         }
      //       });
      //       this.source = new LocalDataSource(list);
      //     }
      // }
       
    } else {
      this._observarInfoTaxistas();
    }
 
  }
  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
   }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
   }


  public _observarInfoTaxistas() {
     this.servicioFirebase.obtenerCollection('choferes', 'nombre')
            .then((list:any) => {
              this.infoChoferes = [];
              this.loading = false;
              this.infoChoferes = list;

              this.countAyudantes = 0;
              this.countSocios = 0;
              this.countConectados = 0;
              this.countTotal = 0;

              this.infoChoferes.forEach(element => {
                console.log(element);
                
                if(element.etiqueta === '1'){
                  this.countSocios ++;
                } else {
                  this.countAyudantes ++;
                }
                if(element.activo){
                  this.countConectados ++;
                }
              });
              this.countTotal = this.infoChoferes.length;
              console.log(this.infoChoferes);
              this.source = new LocalDataSource(this.infoChoferes);
            });
  }

  abrirAgregarChofer() {
    this.router.navigate(['/agregar-chofer']);
  }

  refrescar(){
     localStorage.removeItem('choferes');
     this.loading = true;
     this._observarInfoTaxistas();
  }


  onChangePager(number:any){
    this.source.getPaging().perPage = number;
    this.source.refresh();
  }
}
