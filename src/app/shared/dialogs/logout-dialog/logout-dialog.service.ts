import { Inject, Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LogoutDialogComponent } from './logout-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LogoutDialogService {
  private dialog = inject(MatDialog);

  public open(): Observable<boolean | undefined> {
    const dialog = this.dialog.open<LogoutDialogComponent, boolean>(
      LogoutDialogComponent,
    );
    return dialog.afterClosed();
  }
}
