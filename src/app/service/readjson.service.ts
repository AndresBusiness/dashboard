import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadjsonService {

  constructor(private http: HttpClient) { }

  obtenerItemJson(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/rolles.json');
  }

}
