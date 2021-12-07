import { Component, Input, OnInit } from '@angular/core';
import { AppComponent, ListTypes } from '../app.component'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublisherService } from './publisher.service';
import { DataCatalogue } from '../administrator/administrator.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdministratorService } from '../administrator/administrator.service';

export interface DeliveryPolicy {
  id: number;
  created_at: Date;
  policy_type: string;
  transformations: Transformation;
}

export interface Transformation {
  item_operator: string;
  item_type: string;
  organization_type: string;
  organization_name: string;
  json_path: string;
}

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PublisherComponent implements OnInit {

  DELIVERY_DATA: DeliveryPolicy[] = [
    // {policyId: 1, policyDate: new Date('2021-11-17'), policyType: "DATA_CONTENT_BASED"},
  ];
  newPublication: boolean = false;
  displayedColumns: string[] = ['policyId', 'policyDate', 'policyType', 'edit_policy', 'delete_policy'];
  dataSource = this.DELIVERY_DATA;
  deliveryPolicyForm: FormGroup;
  policyTypes: ListTypes[];
  catalogues: DataCatalogue[] = [];
  organizationsName: string[] = [];
  organizationsType: string[] = [];
  operators: ListTypes[];
  types: ListTypes[];

  transformationList: Transformation[] = [
    // {item_operator: 'endpoint_restriction', item_type:'organization_name' , json_path:'json'}
  ];

  expandedElement: DeliveryPolicy | null;

  constructor(
    public appComponent: AppComponent,
    public publisherService: PublisherService,
    public administratorService: AdministratorService,
    private router: Router,
    private _fb: FormBuilder,
  ) {
    this.deliveryPolicyForm = this._fb.group({
      policy_type: ['', Validators.required],
      catalogue_id: ['', Validators.required],
      transformations: _fb.group({
        organization_name: [''],
        organization_type: [''],
        json_path: [''],
        item_type: ['', Validators.required],
        item_operator: ['', Validators.required],
      })
    });

    this.policyTypes = [
      { value: 'topic_based', viewValue: 'TOPIC BASED' },
      { value: 'data_structure_based', viewValue: 'DATA STRUCTURE BASED' }
    ]

    this.operators = [
      { value: 'endpoint_restriction', viewValue: 'Endpoint restriction' },
      { value: 'payload_extraction', viewValue: 'Payload extraction' },
    ]
    this.types = [
      { value: 'organization_type', viewValue: 'Organization type' },
      { value: 'organization_name', viewValue: 'Organization name' },
      { value: 'data_based', viewValue: 'Data based' }
    ]

    if (!this.appComponent.user) {
      //   this.router.navigate(['/']);
      this.appComponent.user = { id: 1, email: 'leo.grignon@thalesgroup.com', profile: 'administrator' };
    }
    this.getAllPolicies()
  }

  ngOnInit(): void {
  }

  getAllPolicies(): void {
    // Get users from database
    this.publisherService
      .getPublisherPolicy(
        this.appComponent.user.email
      )
      .subscribe(
        (response) => {
          this.DELIVERY_DATA = []
          response.policies.forEach((p: any) => {
            this.DELIVERY_DATA.push({
              'id': p.policy.id,
              'created_at': new Date(p.policy.created_at),
              'policy_type': p.policy.policy_type,
              'transformations': p.transformations,
            }
            )
          });
          // Add policies to publisher policies table
          this.dataSource = this.DELIVERY_DATA;
        }
      )
  }

  getAllData(policy_type: string): void {
    this.catalogues = []
    // Get data catalogue elements from database
    this.administratorService
      .getDataCatalogue(
        policy_type
      )
      .subscribe(
        (response) => {
          response.data.forEach((data: DataCatalogue) => {
            this.catalogues.push(data)
          });
        }
      )
  }

  deletePolicy(policy_id: number) {

  }

  resetTransformations(): void {
    this.organizationsName = [];
    this.organizationsType = [];
    this.deliveryPolicyForm.get('transformations').get('organization_type').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('organization_type').reset();
    this.deliveryPolicyForm.get('transformations').get('organization_name').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('organization_name').reset();
  }

  getOrganizations(item_type: string): void {
    this.resetTransformations();

    if (item_type == 'organization_type') {
      // Get data catalogue elements from database
      this.publisherService
        .getOrganizationsType()
        .subscribe(
          (response) => {
            response.organizations_type.forEach((type: string) => {
              this.organizationsType.push(type)
            });
            this.deliveryPolicyForm.get('transformations').get('organization_type').setValidators(Validators.required)
          }
        )
    } else if (item_type == 'organization_name') {
      // Get data catalogue elements from database
      this.publisherService
        .getOrganizationsName()
        .subscribe(
          (response) => {
            response.organizations_name.forEach((name: string) => {
              this.organizationsName.push(name)
            });
            this.deliveryPolicyForm.get('transformations').get('organization_name').setValidators(Validators.required)
          }
        )
    }
  }

  onPublish() {
    if (this.deliveryPolicyForm.get('policy_type').valid && this.transformationList.length > 0) {
      this.publisherService
        .postPublisherPolicy(
          this.deliveryPolicyForm.get('policy_type').value,
          this.deliveryPolicyForm.get('catalogue_id').value,
          this.transformationList,
          this.appComponent.user.email, //TODO - GET USER EMAIL
        )
        .subscribe(
          (response) => {
            // Clear deliveryPolicyForm
            this.deliveryPolicyForm.reset();
            // Close panel
            this.newPublication = false
            // Refresh policies
            this.getAllPolicies()
          }
        )
    }
  }

  addTransformItem(): void {
    let t = this.deliveryPolicyForm.get('transformations')
    if (t.valid) {
      this.transformationList.push(t.value)
      this.deliveryPolicyForm.get('transformations').reset()
      this.resetTransformations()
    }
  }

  deleteTransformationElement(index: number): void {
    this.transformationList.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.transformationList, event.previousIndex, event.currentIndex);
  }

}
