import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApplicationRoutes } from './const/application-routes';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected title = 'goal';
  protected isLogin = false;
  protected isRegistration = false;
  private router = inject(Router);

  public get showHeader(): boolean {
    return !this.isLogin && !this.isRegistration;
  }

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isLogin = val.url === `/${ApplicationRoutes.Login}`;
        this.isRegistration = val.url === `/${ApplicationRoutes.Registration}`;
      }
    });
  }
}
