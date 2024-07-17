import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ApplicationRoutes } from 'src/app/const/application-routes';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public loaderService = inject(LoaderService);

  readonly appRoutes = ApplicationRoutes;
  protected loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [Validators.required]),
    });
  }

  protected login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loaderService.setLoading(true);
    this.authService
      .login({ email, password })
      .pipe(
        finalize(() => this.loaderService.setLoading(false)),
        tap({
          next: () => {
            return console.log('[next] Called');
          },
          error: (response) =>
            this.snackBar.open(response.message, '', { duration: 3000 }),
          complete: () => this.router.navigate(['']),
        }),
      )
      .subscribe();
  }
}
