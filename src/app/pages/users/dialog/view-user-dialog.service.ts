import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ViewUserDialogComponent } from './view-user-dialog.component';

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
