import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { Router, RouterModule } from '@angular/router';
import { ApplicationRoutes } from 'src/app/const/application-routes';
import { AuthService } from 'src/app/services/auth/auth.service';
import { finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    RouterModule,
  ],
  providers: [MatSnackBar],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  public loaderService = inject(LoaderService);

  readonly appRoutes = ApplicationRoutes;

  protected registrationForm!: FormGroup;

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [Validators.required]),
    });
  }

  protected registration(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    const randomID = Math.floor(Math.random() * 1000);
    const registrationData = {
      id: randomID,
      roles: [1],
      ...this.registrationForm.value,
    };
    this.loaderService.setLoading(true);

    this.authService
      .registration(registrationData)
      .pipe(
        finalize(() => this.loaderService.setLoading(false)),
        tap({
          next: () => console.log('[next] Called'),
          error: (response) =>
            this.snackBar.open(response.error.title, '', {
              duration: 3000,
            }),
          complete: () => this.router.navigate([`${this.appRoutes.Login}`]),
        }),
      )
      .subscribe();
  }
}
