import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component'
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private appComponent: AppComponent,
    private router: Router,
    private http: HttpClient,
  ) {
    this.loginForm = this._fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;

      // Send values to service > to django > check Database > return userProfile
      this.loginService(username, password)
        .subscribe(
          (response) => {
            console.log(response);
            this.appComponent.user = { id: 1, email: 'leo.grignon@thalesgroup.com', profile: 'administrator' };
            this.router.navigate(['/' + this.appComponent.user.profile + '']);
          })
    }
  }

  loginService(
    username: string,
    password: string,
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post<any>(
      'auth',
      {
        'username': username,
        'password': password,
      }, {
      headers: headers,
      responseType: 'json',
      observe: 'response',
    })
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        }
        )
      )
  }

}
