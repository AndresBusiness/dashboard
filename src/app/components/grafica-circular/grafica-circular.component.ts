import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-grafica-circular',
  templateUrl: './grafica-circular.component.html',
  styleUrls: ['./grafica-circular.component.css']
})
export class GraficaCircularComponent implements OnInit {

  @Input() dataGraficaCircular;
  @Input() width;
  @Input() height;
  @Input() title
  @Input() icon;


  schemeType: string = 'ordinal';
  view: any[];
  colorScheme: any;

  public pieChartLabels: any[] = [];

  constructor() { }

  ngOnInit() {
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.getData();      
    console.log(this.dataGraficaCircular)
    this.dataGraficaCircular.forEach(element => {
       element.name = element.value + ' ' +  element.name;
    });
  }

 
 

  getData(){
    this.view =  [(window.innerWidth/3) -118,210];

    this.colorScheme =  {
      name: 'pax',
      selectable: true,
      group: 'Ordinal',
      domain: [
     '#02abbe', '#385385', '#1e5ca3','#03b0f1',  '#00c8ff', '#00eeff' ,'#065ed1', '#0081ff'
      ]
    }
    
  }


  onResize(event) { 
    this.view = [event.target.innerWidth - 1200, 280 ]; 
  }

}
