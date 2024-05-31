import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasillasService {
  private jsonURL = 'assets/casillas.json';

  constructor(private http: HttpClient) { }

  getCasillas(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
}
