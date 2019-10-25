import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html'
})
export class PaginadorComponent implements OnInit {

  @Output() size = new EventEmitter();
  @Input('list') list: any;

  constructor() { }

  ngOnInit() {
  }

  getSize(number:any){
    this.size.emit(number);
  }

}
