import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  constructor(
    private http: HttpClient,
  ) { }

  getUsers():Observable<any>{
    const headers = { 'content-type': 'application/json'}
    return this.http.get<any>(
      'api/getUsers',
      {
      headers:headers,
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

  addUser(
    userValues:Array<string>
  ):Observable<any>{
    const headers = { 'content-type': 'application/json'}
    return this.http.post<any>(
      'api/postUser',
      userValues,
      {
      headers:headers,
      responseType: 'json',
      observe: 'response',
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
