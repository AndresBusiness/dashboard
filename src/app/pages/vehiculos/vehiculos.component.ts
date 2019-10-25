import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  totalVehiculos: number;
  source: LocalDataSource;
  settings: any;
  loading: boolean;
  parametroBusqueda: string;
  listCount:any[]=[];


  constructor(private servicioFirebase: FirebaseService,
    public router: Router) { 
    this.loading = true;
    this.getVehiculos();
  }

  getVehiculos(){
    this.servicioFirebase.obtenerCollection('vehiculos', 'concesion').then((data:any)=>{
      this.loading = false;
      this.listCount = [];
      data.forEach(element => {
        let auto = this.listCount.find((x)=>x.name === element.marca)
        if(!auto){
          this.listCount.push({
            name: element.marca,
            value:1
          });
        } else {
          auto.value++;
        }
      });
      this.totalVehiculos = data.length;
      this.source = new LocalDataSource(data);
      this.listCount = this.order(this.listCount)
      console.log(this.listCount);
      
    });
  }


  order(list:any){
    return  list.sort((a, b) => {
      if (a.value < b.value) { return 1; }
      if (a.value > b.value) { return -1; }
      return 0;
    });
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
        perPage: 30
      },
      columns: {
        concesion: {
          title: 'Concesión',
          filter:true,
        },
        marca: {
          title: 'Marca',
          filter:true
        },
        modelo: {
          title: 'Modelo',
          filter:true,
        },
        anio: {
          title: 'Año',
          filter: false,
        },
        capacidad: {
          title: 'Capacidad',
          filter: false,
        },
        matricula: {
          title: 'Matrícula',
          filter: false,
        },
        nombreChoferRegistro:{
          title: 'Chofer',
          filter: false,
        }
      }
    };
    
  }

  onChangePager(number:any){
    this.source.getPaging().perPage = number;
    this.source.refresh();
  }

  refrescar(){
    localStorage.removeItem('vehiculos');
    this.loading = true;
    this.getVehiculos();
 }

 onUserRowSelect(event): void {
  const path = `/detalle-choferes/${event.data.uidChoferRegistro}`;
  this.router.navigate([path]);
}

}
