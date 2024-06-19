import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewUserDialogComponent } from './view-user-dialog.component';
import { Users } from '../models/user.model';
import { UsersResponse } from 'src/app/services/users/model/users.interface';

@Injectable({
  providedIn: 'root',
})
export class ViewUserDialogService {
  private matDialog = inject(MatDialog);

  open(data: Object): Observable<void> {
    const dialog = this.matDialog.open<ViewUserDialogComponent, Object>(
      ViewUserDialogComponent,
      {
        data: data,
      },
    );
    return dialog.afterClosed();
  }
}
