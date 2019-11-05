import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {  LocalDataSource } from 'ng2-smart-table';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CustomCellFotoComponent } from './custom-cell/custom-cell-foto/custom-cell-foto.component';
 
import * as moment from 'moment';
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
  countHombres: number = 0;
  countMujeres: number = 0;
  countConectados: number = 0;
  countTotal: number= 0;
  parametroBusqueda: string;
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  @ViewChild('buscar', {static : false}) buscar: ElementRef;
  listDataClasificacion =
  [
    {
      "name": "",
      "value": 0
    },
    {
      "name": "",
      "value": 0
    }
  ]
  listDataGenero =
  [
    {
      "name": "",
      "value": 0
    },
    {
      "name": "",
      "value": 0
    }
  ]
  listDataEdad:any[]=[];


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
          filter: false
        },
        nombre: {
          title: 'Nombre',
          filter: false,
        },
        apellidos: {
          title: 'Apellidos',
          filter: false,
        },
        correo: {
          title: 'Correo',
          filter: false,
        },
        edad: {
          title: 'Edad',
          filter: false,
        },
        etiqueta: {
          title: 'Tipo',
          filter: false,
          type: 'html',
          valuePrepareFunction: (etiqueta: any) => {
            const socio = '<div class="custom-badge span-chofer span-socio">Socio</div>';
            const ayudante = '<div class="custom-badge span-chofer span-ayudante">Ayudante</div>';
            return etiqueta === '1' ? socio : ayudante;
          },
        },
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
                if(concesion.placa === buscar.concesion && buscar.nombre === element.nombre
                  && buscar.apellidos === element.apellidos){
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
       else{
           if(this.parametroBusqueda === 'sss' || this.parametroBusqueda === 'aaa'){
             let list = [];
             let etiqueta = this.parametroBusqueda === 'sss' ? '1':'0';
             this.infoChoferes.forEach(element => {
               if(etiqueta === element.etiqueta ){
                 list.push(element);
               }
             });
             this.source = new LocalDataSource(list);
           } else {
                  this.source.setFilter([
                    {
                      field: 'folio',
                      search: this.parametroBusqueda
                    },
                    {
                      field: 'nombre',
                      search: this.parametroBusqueda
                    },
                    {
                      field: 'apellidos',
                      search: this.parametroBusqueda
                    },
                    {
                      field: 'correo',
                      search: this.parametroBusqueda
                    }
                  ], false);
            
           }
       }
       
    } else {
      this._observarInfoTaxistas();
    }
 
  }

  limpiarBusqueda(){
   this.parametroBusqueda = '';
   this.source.setFilter([]);
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
                if(element.genero == '1'){
                  this.countHombres ++;
                } else{
                  this.countMujeres ++;
                }
                if(element.etiqueta === '1'){
                  this.countSocios ++;
                } else {
                  this.countAyudantes ++;
                }
                if(element.activo){
                  this.countConectados ++;
                }

                let arrayDia = (element.fechaNacimiento).split("º");
                let dia = parseInt(arrayDia[0]);
      
                let arrayMes = (arrayDia[1]).split(",");
                let mes = this.meses.indexOf((arrayMes[0].trim())) + 1 ;
                let anio = arrayMes[1].trim();
                let fechaNacimientoFormat = anio + '-'+ mes + '-' + dia
                let edad = this.calculateAge(fechaNacimientoFormat)
                element.edad= edad;
                if(edad >=19 && edad <=30){
                  let existe1920 = this.listDataEdad.find(x=>x.name==='(19-30)')
                  if(!existe1920){
                    this.listDataEdad.push({
                      name: '(19-30)',
                      value:1
                    })
                  }else{
                    existe1920.value++;
                  }
                }
                if(edad >=31 && edad <=40){
                  let existe3140 = this.listDataEdad.find(x=>x.name==='(31-40)')
                  if(!existe3140){
                    this.listDataEdad.push({
                      name: '(31-40)',
                      value:1
                    })
                  }else{
                    existe3140.value++;
                  }
                }
                if(edad >=41 && edad <=50){
                  let existe4150 = this.listDataEdad.find(x=>x.name==='(41-50)')
                  if(!existe4150){
                    this.listDataEdad.push({
                      name: '(41-50)',
                      value:1
                    })
                  }else{
                    existe4150.value++;
                  }
                }
                if(edad >=51 && edad <=60){
                  let existe5160 = this.listDataEdad.find(x=>x.name==='(51-60)')
                  if(!existe5160){
                    this.listDataEdad.push({
                      name: '(51-60)',
                      value:1
                    })
                  }else{
                    existe5160.value++;
                  }
                }
                if(edad >=61){
                  let existe61 = this.listDataEdad.find(x=>x.name==='(61+)')
                  if(!existe61){
                    this.listDataEdad.push({
                      name: '(61+)',
                      value:1
                    })
                  }else{
                    existe61.value++;
                  }
                }

              });
              this.countTotal = this.infoChoferes.length;
              this.source = new LocalDataSource(this.infoChoferes);
              
              this.listDataClasificacion[0].value =this.countSocios
              this.listDataClasificacion[0].name = 'Soc.'
              this.listDataClasificacion[1].value =this.countAyudantes
              this.listDataClasificacion[1].name = 'Aytes.'

              this.listDataGenero[0].value =this.countHombres
              this.listDataGenero[0].name = 'M.'
              this.listDataGenero[1].value = this.countMujeres
              this.listDataGenero[1].name  = 'F.'
              console.log(this.listDataEdad)


              setTimeout(() => {
              
                if(this.buscar){
                  this.buscar.nativeElement.focus();
                }
              });
            
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

  calculateAge(fecha:string) {
    let nacimiento=moment(fecha);
    let hoy=moment();
    return hoy.diff(nacimiento,"years");
  }

}
