import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DefaultFilter } from 'ng2-smart-table';
@Component({
  selector: 'app-custom-cell-tipo',
  template: `
  <select class="tipos" #type name="tipos" style="width: fit-content;"
     (change)='updateValue(type.value)' 
     class="form-control">
    <option value="">Ambos</option>
    <option value="1">Socios</option>
    <option value="0">Ayudantes</option>
  </select>
  `
})
export class CustomCellTipoComponent extends DefaultFilter implements OnInit, OnChanges{

  inputControl = new FormControl();

  constructor() {
    super();
  }

  ngOnInit() {
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        this.query = value !== null ? this.inputControl.value.toString() : '';
        this.setFilter();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  updateValue(data:any){
    if (data) {
      this.query = data;
      this.inputControl.setValue(this.query);
      this.setFilter();
    } else{
      this.query = '';
      this.setFilter();
    }
  }

}
