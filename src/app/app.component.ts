import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface User {
  id: number,
  email: string,
  first_name: string
  last_name: string
  name: string
  type: string
  user_role: string
}

export interface ListTypes {
  value: string;
  viewValue: string;
}

export interface Transformation {
  item_operator: string;
  item_type: string;
  organization_type: string;
  organization_name: string;
  json_path: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User = (<any>window).user_data

  userRoles: ListTypes[] = [
    { value: 'administrator', viewValue: 'Administrator' },
    { value: 'publisher', viewValue: 'Publisher' },
    { value: 'subscriber', viewValue: 'Subscriber' },
  ]

  organizationTypes: ListTypes[] = [
    { value: 'airline', viewValue: 'Airline' },
    { value: 'airport_operator', viewValue: 'Airport Operator' },
    { value: 'air_navigation_service_provider', viewValue: 'Air navigation service provider' },
    { value: 'network_manager', viewValue: 'Network manager' },
    { value: 'ground_handler', viewValue: 'Ground handler' },
    { value: 'meteorological_service_provider', viewValue: 'Meteorological service provider' },
  ]

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message:string, action:string){
    this._snackBar.open(message, action, { 
      duration: 5000
  });
  }
}
