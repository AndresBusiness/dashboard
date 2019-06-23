import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-grafica-barras',
  templateUrl: './grafica-barras.component.html',
  styleUrls: ['./grafica-barras.component.css']
})
export class GraficaBarrasComponent implements OnInit {

  @Input() data: any;
  total: number;
  p_excelente: any;
  p_muybueno: any;
  p_bueno: any;
  p_malo: any;
  p_pesimo: any;

  constructor() { }

  ngOnInit() {
    this.total = this.data.excelente + this.data.muybueno + this.data.bueno + this.data.malo + this.data.pesimo;
    this.p_excelente = ((this.data.excelente * 100) / this.total).toFixed(2);
    this.p_muybueno = ((this.data.muybueno * 100) / this.total).toFixed(2);
    this.p_bueno = ((this.data.bueno * 100) / this.total).toFixed(2);
    this.p_malo = ((this.data.malo * 100) / this.total).toFixed(2);
    this.p_pesimo = ((this.data.pesimo * 100) / this.total).toFixed(2);

  }

}
