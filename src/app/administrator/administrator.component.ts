import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent, ListTypes, User } from '../app.component';
import { AdministratorService } from './administrator.service';

export interface Users {
  first_name: string;
  last_name:string;
  email:string;
  // password:string,
  // hidePassword:boolean,
  user_role:string;
  organization_name:string;
  organization_type:string;
}

export interface DataCatalogue {
  data_type:string;
  data_schema:string;
  data_path:string;
}

export interface DialogUser {
  user:Users;
  action:string;
}

export interface DialogData {
  data:DataCatalogue;
  action:string;
}

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements AfterViewInit, OnInit {
  @ViewChild('sortUser') sortUser: MatSort;
  @ViewChild('sortCatalogue') sortCatalogue: MatSort;
  USER_DATA:Users[] = [
    // EXAMPLE
    // {first_name:'Naomi', last_name:'Smart', email:'naomi.smart@gatwick.com', user_role:'publisher', organization_name:'gatwick', organization_type:'airport_operator'},
  ]

  DATA_CATALOGUE:DataCatalogue[] = [
    // EXAMPLE
    // {data_type:'topic_element', data_schema:'', data_path:'all.topics'},
  ]

  usersDisplayedColumns: string[] = ['firstname', 'lastname','email', /* 'password',  */'role', 'organization_name', 'organization_type', 'edit_user', 'delete_user'];
  usersDataSource = new MatTableDataSource(this.USER_DATA);
  dataCatalogueDisplayedColumns: string[] = ['type', 'path','schema','edit_data_element', 'delete_data_element'];
  dataCatalogueSource = new MatTableDataSource(this.DATA_CATALOGUE);

  constructor(
    public appComponent: AppComponent,
    public administratorService: AdministratorService,
    public dialog: MatDialog,
  ) { 
    if(!this.appComponent.user){
      //   this.router.navigate(['/']);
      this.appComponent.user = {id:45,name:'leo.grignon@thalesgroup.com', profile:'administrator'};
      }
    
    this.getAllUsers();
    this.getAllData();
  }

  ngOnInit():void{
  }

  ngAfterViewInit(): void {
    this.usersDataSource.sort = this.sortUser;
    this.dataCatalogueSource.sort = this.sortCatalogue;
  }

  getAllUsers():void{
    // Get users from database
    this.administratorService
        .getUsers()
        .subscribe(
          (response) => {
            this.USER_DATA = []
            response.users.forEach((user:Users) => {
              this.USER_DATA.push(user)
            });
            // Add users to users table
            this.usersDataSource = new MatTableDataSource(this.USER_DATA);
          }
        )
  }
  
  getAllData():void{
    // Get data catalogue elements from database
    this.administratorService
        .getDataCatalogue()
        .subscribe(
          (response) => {
            this.DATA_CATALOGUE = []
            response.data.forEach((data:DataCatalogue) => {
              this.DATA_CATALOGUE.push(data)
            });
            // Add data to data catalogue table
            this.dataCatalogueSource = new MatTableDataSource(this.DATA_CATALOGUE);
          }
        )
  }

  openDialogUser(user:Users, action:string) {
    const dialogAddUser = this.dialog.open(DialogAddUser,
      {
        width:'25%',
        autoFocus: false,
        disableClose : true,
        closeOnNavigation : true,
        hasBackdrop : true,
        data : {'user':user, 'action':action}
      });

    dialogAddUser.afterClosed().subscribe(result => {
      // After closing dialog AddUser, update the list of users
      this.getAllUsers();
    });
  }

  openDialogData(element:DataCatalogue, action:string) {
    const dialogAddData = this.dialog.open(DialogAddData,
      {
        width:'25%',
        autoFocus: false,
        disableClose : true,
        closeOnNavigation : true,
        hasBackdrop : true,
        data : {'data':element, 'action':action}
      });

      dialogAddData.afterClosed().subscribe(result => {
        // After closing dialog AddData, update the list of data catalogue
        this.getAllData();
      });
  }

  deleteUser(user_email:string){
    this.administratorService
    .deleteUser(
      user_email,
      )
    .subscribe(
      (response) => {
        this.getAllUsers(); 
     }
    )
  }
  
  deleteDataElement(data_id:number){
    this.administratorService
    .deleteDataElement(
      data_id,
      )
    .subscribe(
      (response) => {
        this.getAllData(); 
     }
    )
  }

}

@Component({
  selector: 'dialog-add-user',
  templateUrl: 'dialog-add-user.html',
})
export class DialogAddUser implements OnInit {
  createUserform: FormGroup;

  constructor(
    private administratorService: AdministratorService,
    public appComponent: AppComponent,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddUser>,
    @Inject(MAT_DIALOG_DATA) public dialog_user: DialogUser,
  ) {
    this.createUserform = this._fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      // password: ['', Validators.required],
      role: ['', Validators.required],
      organization_name: ['', Validators.required],
      organization_type: ['', Validators.required],
    })
   }

  ngOnInit():void{
    if(this.dialog_user.user){
      this.createUserform.setValue({
        firstname:this.dialog_user.user.first_name,
        lastname:this.dialog_user.user.last_name,
        email:this.dialog_user.user.email,
        // password:this.dialog_user.user.password,
        role:this.dialog_user.user.user_role,
        organization_name:this.dialog_user.user.organization_name,
        organization_type:this.dialog_user.user.organization_type,
      })
    }
  }

  submitUser():void{
      this.administratorService
        .addUser(
          this.createUserform.value,
          )
        .subscribe(
          (response) => {
            console.log(response)
            this.dialogRef.close()
          }
        )
  }
}

@Component({
  selector: 'dialog-add-data',
  templateUrl: 'dialog-add-data.html',
})
export class DialogAddData implements OnInit {
  dataTypes:ListTypes[];
  createDataform: FormGroup;

  constructor(
    private administratorService: AdministratorService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddUser>,
    @Inject(MAT_DIALOG_DATA) public dialog_data: DialogData,
  ) {
    this.dataTypes = [
      {value:'topic_element', viewValue:'Topic element'},
      {value:'data_element', viewValue:'Data element'}
    ]

    this.createDataform = this._fb.group({
      type: ['', Validators.required],
      path: ['', Validators.required],
      schema: [''],
    })
   }

  ngOnInit():void{
    if(this.dialog_data.data){
      this.createDataform.setValue({
        type:this.dialog_data.data.data_type,
        path:this.dialog_data.data.data_path,
        schema:this.dialog_data.data.data_schema,
      })
    }
  }

  submitData():void{
      this.administratorService
        .addDataCatalogue(
          this.createDataform.value,
          )
        .subscribe(
          (response) => {
            console.log(response)
            this.dialogRef.close()
          }
        )
  }
}
