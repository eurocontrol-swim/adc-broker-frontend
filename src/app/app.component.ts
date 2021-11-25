import { Component } from '@angular/core';

export interface User {
  id:number,
  name:string,
  profile:string
}

export interface ListTypes {
  value:string;
  viewValue:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user:User;

  userRoles:ListTypes[] = [
    {value:'admin', viewValue:'Administrator'},
    {value:'publisher', viewValue:'Publisher'},
    {value:'subscriber', viewValue:'Subscriber'},
  ]

  organizationTypes:ListTypes[] = [
    {value:'airline', viewValue:'Airline'},
    {value:'airport_operator', viewValue:'Airport Operator'},
    {value:'air_navigation_service_provider', viewValue:'Air navigation service provider'},
    {value:'network_manager', viewValue:'Network manager'},
    {value:'ground_handler', viewValue:'Ground handler'},
  ]
}
