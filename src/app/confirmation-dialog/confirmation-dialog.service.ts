import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(public dialog: MatDialog) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string ,
    btnCancelText: string,
  ): Promise<boolean> {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '25%',
      autoFocus: false,
      disableClose: true,
      closeOnNavigation: false,
      hasBackdrop: true,
    });

    confirmDialog.componentInstance.title = title;
    confirmDialog.componentInstance.message = message;
    confirmDialog.componentInstance.btnOkText = btnOkText;
    confirmDialog.componentInstance.btnCancelText = btnCancelText;

    return confirmDialog.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(confirm => {
        return Promise.resolve(confirm); // will return a Promise here
      });
  }
}
