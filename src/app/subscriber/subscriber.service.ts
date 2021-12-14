import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Transformation } from '../app.component'

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(
    private http: HttpClient,
  ) { }

  getSubscriberPolicy(
    user_mail: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.get<any>(
      'api/getSubscriberPolicy?user_mail=' + user_mail,
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

  postSubscriberPolicy(
    policy_id: string,
    policy_type: string,
    catalogue_id: number,
    transformations: Transformation[],
    user_email: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post<any>(
      'api/postSubscriberPolicy',
      {
        'policy_id': policy_id,
        'policy_type': policy_type,
        'catalogue_id': catalogue_id,
        'transformations': transformations,
        'user_email': user_email
      },
      {
        headers: headers,
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

  deleteSubscriberPolicy(
    policy_id: number,
    user_email: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.delete<any>(
      'api/deleteSubscriberPolicy',
      {
        headers: headers,
        body: { 'user_email': user_email, 'policy_id': policy_id },
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
