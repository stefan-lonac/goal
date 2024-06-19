import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationRoutes } from './const/application-routes';
import { isLoggedInGuard } from './services/guards/is-logged-in.guard';
import { CanDeactivateEditGuardFn } from './services/guards/can-deactivate-edit.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page/home-page.component').then(
        (c) => c.HomePageComponent,
      ),
    canActivate: [isLoggedInGuard],
  },
  {
    path: `${ApplicationRoutes.Users}`,
    loadComponent: () =>
      import('./pages/users/users.component').then((c) => c.UsersComponent),
    canActivate: [isLoggedInGuard],
  },
  {
    path: `${ApplicationRoutes.Account}`,
    loadComponent: () =>
      import('./pages/user/account/account/account.component').then(
        (c) => c.AccountComponent,
      ),
    canActivate: [isLoggedInGuard],
    canDeactivate: [CanDeactivateEditGuardFn],
  },
  {
    path: `${ApplicationRoutes.Login}`,
    loadComponent: () =>
      import('./pages/user/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: `${ApplicationRoutes.Registration}`,
    loadComponent: () =>
      import('./pages/user/registration/registration.component').then(
        (c) => c.RegistrationComponent,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
