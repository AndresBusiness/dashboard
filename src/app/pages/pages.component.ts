import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

declare function init_plugins();
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {
  esMonitoreo: boolean;
  constructor(private router: Router) {
    this.getDataRoute()
    .subscribe(data => {
      console.log(data.titulo)
      if(data.titulo == 'Monitoreo de Unidades'){
        this.esMonitoreo = true;
      }else{
        this.esMonitoreo = false;
      }
    });
   }

  ngOnInit() {
    init_plugins();
  }
  getDataRoute() {
    return this.router.events.pipe(
      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd ) => evento.snapshot.data )

    );
  }

}
