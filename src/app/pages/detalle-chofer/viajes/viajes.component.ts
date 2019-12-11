import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/service/firebase.service';
import * as moment from 'moment';
@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css']
})
export class ViajesComponent implements OnInit {


  @Input() uidChofer:string;
  estatus:string = 'completado';
  list:any[]=[];
  private _observableSubscription: Subscription;
  count:number= 0;
  constructor( private servicioFirebase: FirebaseService) { }

  ngOnInit() {
    this._observableSubscription = 
    this.servicioFirebase.obtenerViajesChofer(this.uidChofer, this.estatus, 
      parseInt(moment().format("YYYYMMDD") + '000000'), parseInt(moment().format("YYYYMMDD")+ '999999') ).subscribe(data=>{
        this.list=[];
        this.count = 0;
        this.list = data;
        this.count =this.list.length;

        console.log(data)
      })
  }

  ngOnDestroy(): void {
    this._observableSubscription.unsubscribe();
    console.log('destruido el observador de viajes')
  }

}
