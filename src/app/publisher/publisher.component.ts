import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponent, ListTypes, Transformation } from '../app.component'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublisherService } from './publisher.service';
import { DataCatalogue } from '../administrator/administrator.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdministratorService } from '../administrator/administrator.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { AppService } from '../app.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdcLabelPipe } from '../app-label.pipe';

export interface DeliveryPolicy {
  id: number;
  created_at: Date;
  policy_type: string;
  catalogue: DataCatalogue;
  transformations: Transformation;
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
  displayedColumns: string[] = ['id', 'created_at', 'policy_type', 'edit_policy', 'delete_policy'];
  dataSource: MatTableDataSource<DeliveryPolicy>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  deliveryPolicyForm: FormGroup;
  policyTypes: ListTypes[];
  catalogues: DataCatalogue[] = [];
  organizationsName: string[] = [];
  organizationsType: string[] = [];
  operators: ListTypes[];
  types: ListTypes[];

  create_or_update: boolean = true;

  transformationList: Transformation[] = [
    // {item_operator: 'endpoint_restriction', item_type:'organization_name' , json_path:'json'}
  ];

  expandedElement: DeliveryPolicy | null;

  constructor(
    public appComponent: AppComponent,
    public publisherService: PublisherService,
    public appService: AppService,
    public administratorService: AdministratorService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private _fb: FormBuilder,
    private adcLabel: AdcLabelPipe,
  ) {
    if (!this.appComponent.user) {
      this.router.navigate(['/']);
    } else if (this.appComponent.user.user_role != 'publisher') {
      this.router.navigate([this.appComponent.user.user_role]);
    } else {
      this.getAllPolicies()
    }

    this.deliveryPolicyForm = this._fb.group({
      policy_id: [null, Validators.required],
      policy_type: ['', Validators.required],
      catalogue_id: ['', Validators.required],
      transformations: _fb.group({
        organization_name: [''],
        organization_type: [''],
        json_path: [''],
        item_type: [''],
        item_operator: [''],
      })
    });

    this.policyTypes = [
      { value: 'topic_based', viewValue: 'TOPIC BASED' },
      { value: 'data_structure_based', viewValue: 'DATA STRUCTURE BASED' }
    ]

    this.operators = [
      { value: 'organization_name_endpoint_restriction', viewValue: 'Organization name endpoint restriction' },
      { value: 'organization_type_endpoint_restriction', viewValue: 'Organization type endpoint restriction' },
      { value: 'payload_extraction', viewValue: 'Payload extraction' },
    ]

    this.types = [
      { value: 'organization_type', viewValue: 'Organization type' },
      { value: 'organization_name', viewValue: 'Organization name' },
      { value: 'data_based', viewValue: 'Data based' }
    ]

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
              'catalogue': p.catalogue,
              'transformations': p.transformations,
            }
            )
          });
          // Add policies to publisher policies table
          this.dataSource = new MatTableDataSource(this.DELIVERY_DATA);
          this.dataSource.sort = this.sort;
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
    this.confirmationDialogService.confirm('Delete publisher policy', 'Please confirm the deletion of this policy.', 'Delete the policy', 'Cancel')
      .then((confirmed: boolean) => {
        if (confirmed) {
          this.publisherService
            .deletePublisherPolicy(
              policy_id,
              this.appComponent.user.email,
            )
            .subscribe(
              (response) => {
                this.appComponent.openSnackBar(response.body.message, 'Close')

                this.getAllPolicies();
              }
            )
        }
      })
      .catch(() => console.log('User dismissed the confirmed dialog'));
  }

  editPolicy(policy: any) {
    this.create_or_update = false;
    this.newPublication = true;
    console.log(policy)
    this.getAllData(policy.policy_type);
    this.deliveryPolicyForm.patchValue({
      policy_id: policy.id,
      policy_type: policy.policy_type,
      catalogue_id: policy.catalogue[0].id,
    });

    this.transformationList = [];
    policy.transformations.forEach((transformation: Transformation) => {
      this.transformationList.push(transformation)
    });
  }

  resetTransformations(): void {
    this.organizationsName = [];
    this.organizationsType = [];
    this.deliveryPolicyForm.get('transformations').get('organization_type').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('organization_type').reset();
    this.deliveryPolicyForm.get('transformations').get('organization_name').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('organization_name').reset();
    this.deliveryPolicyForm.get('transformations').get('json_path').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('json_path').reset();
    this.deliveryPolicyForm.get('transformations').get('item_operator').clearValidators();
    this.deliveryPolicyForm.get('transformations').get('item_operator').reset();
  }

  getOrganizations(item_type: string): void {
    this.resetTransformations();

    if (item_type == 'data_based') {
      this.deliveryPolicyForm.get('transformations').get('json_path').setValidators(Validators.required);
      this.deliveryPolicyForm.get('transformations').get('item_operator').setValidators(Validators.required);
    }
    else if (item_type == 'organization_type') {
      // Get data catalogue elements from database
      this.appService
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
      this.appService
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
    if (this.deliveryPolicyForm.get('policy_type').valid && this.deliveryPolicyForm.get('catalogue_id').valid) {
      //  && this.transformationList.length > 0
      this.publisherService
        .postPublisherPolicy(
          this.deliveryPolicyForm.get('policy_id').value,
          this.deliveryPolicyForm.get('policy_type').value,
          this.deliveryPolicyForm.get('catalogue_id').value,
          this.transformationList,
          this.appComponent.user.email, //TODO - GET USER EMAIL
        )
        .subscribe(
          (response) => {
            this.appComponent.openSnackBar(response.body.message, 'Close')

            // Clear deliveryPolicyForm
            this.deliveryPolicyForm.reset();
            this.transformationList = [];
            this.resetTransformations();
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
    this.confirmationDialogService.confirm('Delete transformation element', 'Please confirm the deletion of this transformation element.', 'Delete the transformation element', 'Cancel')
      .then((confirmed: boolean) => {
        if (confirmed) {
          this.transformationList.splice(index, 1);
        }
      })
      .catch(() => console.log('User dismissed the confirmed dialog'));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.transformationList, event.previousIndex, event.currentIndex);
  }

}
