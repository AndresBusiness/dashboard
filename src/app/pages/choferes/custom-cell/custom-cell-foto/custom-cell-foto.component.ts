import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-cell-foto',
  template: `
  <div style="position: relative; width: 100%">
      <div style="
      text-align: center;
      background: #097ca6;
      border-radius: 50%;
      margin: 10px;
      width: 60px;
      height: 60px;">
          <div style=" display: inline-block;
          position: relative;
          width: 60px;
          height: 60px;
          margin-top: 2px;
          margin-left: -4px;
          text-align:center;
          overflow: hidden;
          border-radius: 50%;">
            <img  width="60" height="60" style=" width: auto;height: 100%;" class="animated fadeIn" [src]="value" />
          </div>  
      </div>  
  </div>


  `
})
export class CustomCellFotoComponent implements OnInit {

  constructor() { }

  public value: string;
  ngOnInit() {
  }

}
