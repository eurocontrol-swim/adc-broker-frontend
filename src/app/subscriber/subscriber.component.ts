import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { AppComponent, ListTypes, Transformation } from '../app.component';
import { DataCatalogue } from '../administrator/administrator.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppService } from '../app.service';
import { SubscriberService } from './subscriber.service';
import { AdministratorService } from '../administrator/administrator.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdcLabelPipe } from '../app-label.pipe';
import { Router } from '@angular/router';

export interface SubcriberPolicy {
  id: number;
  created_at: Date;
  policy_type: string;
  delivery_end_point: string;
  catalogue: DataCatalogue;
  transformations: Transformation;
}

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SubscriberComponent implements OnInit, AfterViewInit {
  SUBSCRIBER_DATA: SubcriberPolicy[] = [
    // { id: 1, created_at: new Date('2021-11-17'), policy_type: "policy_type", delivery_end_point: '', catalogue: { id: 1, data_type: '', data_schema: '', data_path: '' }, transformations: { item_operator: '', item_type: '', organization_type: '', organization_name: '', json_path: '' } },
    // { id: 2, created_at: new Date('2021-11-17'), policy_type: "policy_type", delivery_end_point: '', catalogue: { id: 1, data_type: '', data_schema: '', data_path: '' }, transformations: { item_operator: '', item_type: '', organization_type: '', organization_name: '', json_path: '' } },
  ];
  displayedColumns: string[] = ['id', 'created_at', 'policy_type', 'delivery_end_point', 'edit_policy', 'delete_policy'];
  dataSource: MatTableDataSource<SubcriberPolicy>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  expandedElement: SubcriberPolicy | null;
  newPublication: boolean = false;
  subscribePolicyForm: FormGroup;
  policyTypes: ListTypes[];
  catalogues: DataCatalogue[] = [];
  organizationsName: string[] = [];
  organizationsType: string[] = [];
  operators: ListTypes[];
  types: ListTypes[];

  transformationList: Transformation[] = [
    // {item_operator: 'endpoint_restriction', item_type:'organization_name' , json_path:'json'}
  ];

  create_or_update: boolean = true;

  constructor(
    public appComponent: AppComponent,
    public appService: AppService,
    public administratorService: AdministratorService,
    public subscriberService: SubscriberService,
    private confirmationDialogService: ConfirmationDialogService,
    private _fb: FormBuilder,
    private adcLabel: AdcLabelPipe,
    private router: Router,
  ) {

    if (!this.appComponent.user) {
      this.router.navigate(['/']);
    } else if (this.appComponent.user.user_role != 'subscriber') {
      this.router.navigate([this.appComponent.user.user_role]);
    } else {
      this.getAllPolicies()
    }

    this.subscribePolicyForm = this._fb.group({
      policy_id: [null],
      policy_type: [null, Validators.required],
      catalogue_id: [null, Validators.required],
      transformations: _fb.group({
        organization_name: [null],
        organization_type: [null],
        json_path: [null],
        item_type: [null],
        item_operator: [null],
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

  ngAfterViewInit(): void {
  }

  editPolicy(policy: any) {
    this.create_or_update = false;
    this.newPublication = true;
    this.getAllData(policy.policy_type);
    this.subscribePolicyForm.patchValue({
      policy_id: policy.id,
      policy_type: policy.policy_type,
      catalogue_id: policy.catalogue[0].id,
    });

    this.transformationList = [];
    policy.transformations.forEach((transformation: Transformation) => {
      this.transformationList.push(transformation)
    });
  }

  deletePolicy(policy_id: number) {
    this.confirmationDialogService.confirm('Delete subscriber policy', 'Please confirm the deletion of this policy.', 'Delete the policy', 'Cancel')
      .then((confirmed: boolean) => {
        if (confirmed) {
          this.subscriberService
            .deleteSubscriberPolicy(
              policy_id,
              this.appComponent.user.email,
            )
            .subscribe(
              (response) => {
                this.appComponent.openSnackBar(response.message, 'Close')

                this.getAllPolicies();
              }
            )
        }
      })
      .catch(() => console.log('User dismissed the confirmed dialog'));
  }

  getAllPolicies(): void {
    // Get users from database
    this.subscriberService
      .getSubscriberPolicy(
        this.appComponent.user.email
      )
      .subscribe(
        (response) => {
          this.SUBSCRIBER_DATA = []
          response.policies.forEach((p: any) => {
            this.SUBSCRIBER_DATA.push({
              'id': p.policy.id,
              'created_at': new Date(p.policy.created_at),
              'policy_type': p.policy.policy_type,
              'delivery_end_point': p.policy.delivery_end_point,
              'catalogue': p.catalogue,
              'transformations': p.transformations,
            }
            )
          });
          // Add policies to publisher policies table
          this.dataSource = new MatTableDataSource(this.SUBSCRIBER_DATA);
          this.dataSource.sort = this.sort;
        }
      )
  }

  getAllData(policy_type: string): void {
    this.catalogues = []
    this.subscribePolicyForm.get('catalogue_id').reset();
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

  resetTransformations(): void {
    this.organizationsName = [];
    this.organizationsType = [];
    this.subscribePolicyForm.get('transformations').get('organization_type').clearValidators();
    this.subscribePolicyForm.get('transformations').get('organization_type').reset();
    this.subscribePolicyForm.get('transformations').get('organization_name').clearValidators();
    this.subscribePolicyForm.get('transformations').get('organization_name').reset();
    this.subscribePolicyForm.get('transformations').get('json_path').clearValidators();
    this.subscribePolicyForm.get('transformations').get('json_path').reset();
    this.subscribePolicyForm.get('transformations').get('item_operator').clearValidators();
    this.subscribePolicyForm.get('transformations').get('item_operator').reset();
  }

  getOrganizations(item_type: string): void {
    this.resetTransformations();

    if (item_type == 'data_based') {
      this.subscribePolicyForm.get('transformations').get('json_path').setValidators(Validators.required);
      this.subscribePolicyForm.get('transformations').get('item_operator').setValidators(Validators.required);
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
            this.subscribePolicyForm.get('transformations').get('organization_type').setValidators(Validators.required)
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
            this.subscribePolicyForm.get('transformations').get('organization_name').setValidators(Validators.required)
          }
        )
    }
  }

  onPublish() {
    if (this.subscribePolicyForm.valid) {
      this.subscriberService
        .postSubscriberPolicy(
          this.subscribePolicyForm.get('policy_id').value,
          this.subscribePolicyForm.get('policy_type').value,
          this.subscribePolicyForm.get('catalogue_id').value,
          this.transformationList,
          this.appComponent.user.email,
        )
        .subscribe(
          (response) => {
            this.appComponent.openSnackBar(response.body.message, 'Close')

            // Clear subscribePolicyForm
            this.subscribePolicyForm.reset();
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
    let t = this.subscribePolicyForm.get('transformations')
    if (t.valid) {
      this.transformationList.push(t.value)
      this.subscribePolicyForm.get('transformations').reset()
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
