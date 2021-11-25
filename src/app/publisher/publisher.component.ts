import { Component, Input, OnInit } from '@angular/core';
import {AppComponent, ListTypes} from '../app.component'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DeliveryPolicy {
  policyId: number;
  policyDate: Date;
  policyType: string;
}

const DELIVERY_DATA: DeliveryPolicy[] = [
  {policyId: 1, policyDate: new Date('2021-11-17'), policyType: "DATA_CONTENT_BASED"},
  {policyId: 2, policyDate: new Date('2021-11-18'), policyType: "TOPIC_BASED"},
  {policyId: 3, policyDate: new Date('2021-11-19'), policyType: "DATA_CONTENT_BASED"},
  {policyId: 4, policyDate: new Date('2021-11-19'), policyType: "TOPIC_BASED"},
];

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit {

  newPublication:boolean = false;
  displayedColumns: string[] = ['policyId', 'policyDate', 'policyType'];
  dataSource = DELIVERY_DATA;
  deliveryPolicyForm: FormGroup;
  policy_types:ListTypes[];
  organizations_name:ListTypes[];
  organizations_type:ListTypes[];

  constructor(
    public appComponent : AppComponent,
    private router: Router,
    private _fb: FormBuilder,
  ) {
    this.deliveryPolicyForm = this._fb.group({
      policy_type: ['', Validators.required],
      organization_list: ['', Validators.required],
      organization_type: ['', Validators.required],
    });

    this.policy_types = [
      {value:'topic_based', viewValue:'TOPIC BASED'},
      {value:'data_content_based', viewValue:'DATA CONTENT BASED'}
    ]
    
    this.organizations_name = [
      {value:'easyjet', viewValue:'easyJet'},
      {value:'air_france', viewValue:'Air France'},
      {value:'klm', viewValue:'KLM'}
    ]
    
    this.organizations_type = [
      {value:'airport', viewValue:'Airports'},
      {value:'airline', viewValue:'Airlines'},
      {value:'ground_handler', viewValue:'Ground Handler'}
    ]

    if(!this.appComponent.user){
      //   this.router.navigate(['/']);
      this.appComponent.user = {id:45,name:'leo.grignon@thalesgroup.com', profile:'administrator'};
      }
   }

  ngOnInit(): void {
  }

  onPublish(){

  }

}
