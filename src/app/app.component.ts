import { Component } from '@angular/core';

export interface User {
  id: number,
  email: string,
  profile: string
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
  user: User;

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
}
