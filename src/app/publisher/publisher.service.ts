import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Transformation } from './publisher.component'

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(
    private http: HttpClient,
  ) { }

  getPublisherPolicy(
    user_mail: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.get<any>(
      'api/getPublisherPolicy?user_mail=' + user_mail,
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

  postPublisherPolicy(
    policy_id: string,
    policy_type: string,
    catalogue_id: number,
    transformations: Transformation[],
    user_email: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post<any>(
      'api/postPublisherPolicy',
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

  deletePublisherPolicy(
    policy_id: number,
    user_email: string
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.delete<any>(
      'api/deletePublisherPolicy',
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
