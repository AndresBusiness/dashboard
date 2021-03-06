import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadjsonService {

  constructor(private http: HttpClient) { }

  obtenerItemJsonChofer(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/infoChoferes.json');
  }

  obtenerItemJsonConcesion(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/ubicacionUnidades.json');
  }

}
