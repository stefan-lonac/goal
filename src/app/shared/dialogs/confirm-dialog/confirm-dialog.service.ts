import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogDataModel } from './model/confirm-dialog.model';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  public open(data: ConfirmationDialogDataModel): Observable<boolean> {
    const dialog = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmationDialogDataModel
    >(ConfirmDialogComponent, {
      data,
    });

    return dialog.afterClosed();
  }
}
