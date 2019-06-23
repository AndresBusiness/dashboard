import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit{
  calificaciones = {
    'excelente': 3713,
    'muybueno': 742,
    'bueno': 247,
    'malo': 148,
    'pesimo':99
  }
  constructor() {
  }

  ngOnInit() {
  }

}
