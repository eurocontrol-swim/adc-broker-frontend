import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component'
import { Router } from '@angular/router';

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
      // this.loginService
      //   .auth(username, password)
      //   .then(() => {
      //     this.authSuccessful = true;

      this.appComponent.user = { id: 1, email: 'leo.grignon@thalesgroup.com', profile: 'administrator' };

      this.router.navigate(['/' + this.appComponent.user.profile + '']);

      //   })
      //   .catch(() => {
      //     this.authInvalid = true;
      //   });
    }
  }

}
