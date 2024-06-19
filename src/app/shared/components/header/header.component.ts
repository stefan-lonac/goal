import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {
  LangDefinition,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { ApplicationRoutes } from 'src/app/const/application-routes';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { LogoutDialogService } from '../../dialogs/logout-dialog/logout-dialog.service';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
  ],
})
export class HeaderComponent {
  private translocoService = inject(TranslocoService);
  private authService = inject(AuthService);
  private logoutDialogService = inject(LogoutDialogService);

  protected isLoggedIn = this.authService.isLoggedIn();
  readonly appRoutes = ApplicationRoutes;

  protected get activeLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  protected get languages(): Array<LangDefinition> {
    return this.translocoService.getAvailableLangs() as Array<LangDefinition>;
  }

  constructor() {
    const activeLocal = localStorage.getItem('selectedLanguage')!;
    this.translocoService.setActiveLang(activeLocal);
  }

  protected changeLanguage(lang: LangDefinition['id']): void {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  protected logOut(): void {
    this.logoutDialogService
      .open()
      .pipe(
        filter((isClose) => !!isClose),
        tap(() => this.authService.logout()),
      )
      .subscribe();
  }
}
