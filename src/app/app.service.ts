import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Transformation } from './app.component'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient,
  ) { }

  getOrganizationsType(
    ): Observable<any> {
      const headers = { 'content-type': 'application/json' }
      return this.http.get<any>(
        'api/getOrganizationsType',
        {
          headers: headers,
          responseType: 'json',
        }
      )
        .pipe(
          catchError((err) => {
            console.error(err);
            throw err;
          }
          )
        )
    }
  
    getOrganizationsName(
    ): Observable<any> {
      const headers = { 'content-type': 'application/json' }
      return this.http.get<any>(
        'api/getOrganizationsName',
        {
          headers: headers,
          responseType: 'json',
        }
      )
        .pipe(
          catchError((err) => {
            console.error(err);
            throw err;
          }
          )
        )
    }
}
