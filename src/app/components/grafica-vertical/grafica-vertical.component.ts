import { element } from 'protractor';
import { Component, OnInit, Input, AfterContentInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-grafica-vertical',
  templateUrl: './grafica-vertical.component.html',
  styleUrls: ['./grafica-vertical.component.css']
})
export class GraficaVerticalComponent implements OnInit {

  view: any[];
  @Input()width;
  @Input()height;
  @Input()title;
  legendPosition:string = 'top';
  @Input() listdata;
  bandera:boolean = false;



  schemeType: string = 'ordinal';
  colorScheme: any;

  constructor() { }
 
  ngOnInit() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.bandera = false;
    setTimeout(() => {
      this.bandera = true;
      this.getData();     
      this.listdata.forEach(element => {
        element.name = element.value + ' ' +  element.name
    }); 
    }, 300);
  }

  getData(){
   
    this.view  = [window.innerWidth -550,  this.height];
    
    this.colorScheme =  {
      name: 'pax',
      selectable: true,
      group: 'Ordinal',
      domain: [
        '#1e5ca3', '#065ed1', '#0081ff', '#03b0f1',  '#00c8ff', '#00eeff' 
      ]
    }
  }

  onResize(event) { 
    if(event.target.innerWidth >700){
      this.view = [event.target.innerWidth -550, 400 ]; 
    } else{
    this.view = [event.target.innerWidth , 400 ]; 

    }
  }


}
