import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from '../../../node_modules/rxjs';
import 'rxjs/Rx';

@Injectable()
export class FunctionsService  {


    urlServerNode:string       = "https://us-central1-directtaxi-prod.cloudfunctions.net/app";
    private cabeceras = new Headers({
      'Content-Type'                     :'application/json',
      'Access-Control-Expose-Headers'    :'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Origin'      : '*',
      'Access-Control-Allow-Methods'     :'POST',
      'Access-Control-Allow-Credentials' :'true'
    });
  
    constructor(private http:Http ) {
    }
  
    launchPetitionServerNode(method, obj:any) :Observable<any> {
      const body = JSON.stringify( obj );
      const URL = `${this.urlServerNode}/${ method }`;
      return this.http.post(URL, body, { headers: this.cabeceras })
         .map( res=> res.json());
    }

    registarChofer(obj:any) {
        return this.launchPetitionServerNode("registrarUsuario", obj);
      }
      

}
