import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/services/users/users.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { ViewUserDialogService } from './dialog/view-user-dialog.service';
import { ViewUserDialogComponent } from './dialog/view-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable, filter, finalize, switchMap } from 'rxjs';
import { UsersResponse } from 'src/app/services/users/model/users.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatTableModule,
    MatButtonModule,
    ViewUserDialogComponent,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  private viewUserDialogService = inject(ViewUserDialogService);
  protected loaderService = inject(LoaderService);

  protected readonly displayedColumns: Array<UsersListTypes> = [
    usersColumns.Position,
    usersColumns.Email,
    usersColumns.Name,
    usersColumns.AccountConfirmed,
    usersColumns.Controls,
  ];
  protected users$: Observable<UsersResponse[]> = this.usersService
    .getUsers()
    .pipe(finalize(() => this.loaderService.setLoading(false)));

  ngOnInit(): void {}

  protected viewUser(userID: number): void {
    this.usersService
      .getUserByID(userID)
      .pipe(switchMap((data) => this.viewUserDialogService.open(data)))
      .subscribe();
  }
}

const usersColumns = {
  Position: 'position',
  Name: 'name',
  Email: 'email',
  Controls: 'controls',
  AccountConfirmed: 'accountConfirmed',
};
type UsersListTypes = (typeof usersColumns)[keyof typeof usersColumns];
