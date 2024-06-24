import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { UsersResponse } from 'src/app/services/users/model/users.interface';

@Component({
  selector: 'app-view-user-dialog',
  standalone: true,
  templateUrl: './view-user-dialog.component.html',
  styleUrls: ['./view-user-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, TranslocoModule, MatButtonModule],
})
export class ViewUserDialogComponent {
  public readonly data: UsersResponse = inject(MAT_DIALOG_DATA);
}
