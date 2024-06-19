import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable, finalize, switchMap, tap } from 'rxjs';
import { FormStatusService } from 'src/app/services/form/form-status.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UsersResponse } from 'src/app/services/users/model/users.interface';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class AccountComponent implements OnInit {
  private formStatusService = inject(FormStatusService);
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);
  protected loaderService = inject(LoaderService);
  protected userDataResponse!: UsersResponse;

  protected profileForm!: FormGroup;
  protected editMode!: boolean;

  protected userData$: Observable<UsersResponse> = this.usersService
    .getCurrentUser()
    .pipe(finalize(() => this.loaderService.setLoading(false)));

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  protected onFormChange(isEdited: boolean): void {
    this.formStatusService.setFormEdited(isEdited);
  }

  protected onInputChange(): void {
    return this.onFormChange(false);
  }

  protected onSave(userData: UsersResponse): void {
    if (this.profileForm.invalid) {
      this.onFormChange(false);
    }

    const emailUpdate = this.profileForm.controls['email'].value;
    const nameUpdate = this.profileForm.controls['name'].value;

    const updateUserData = {
      id: userData.id,
      name: nameUpdate,
      email: emailUpdate,
      password: userData.password,
      roles: [1],
    };

    this.usersService
      .updateCurrentUser(updateUserData)
      .pipe(
        tap(() => {
          this.onFormChange(true);
          this.cancelEdit();
        }),
        switchMap(() => this.userData$),
      )
      .subscribe();
  }

  protected onEditMode() {
    this.editMode = true;
  }

  protected cancelEdit() {
    this.editMode = false;
    this.onFormChange(true);
  }
}
