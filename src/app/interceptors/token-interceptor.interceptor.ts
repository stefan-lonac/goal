import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

import { environment } from '../environments/env.const';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private tokenUsed: boolean = false;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(request);
    }

    const accessToken = this.authService._authToken;
    request = this.addToken(request, accessToken);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('Login/login')) {
          return this.handle401Error(request, next);
        }

        if (request.url.includes('Login/refresh')) {
          this.authService.logout();
        }

        return throwError(() => {
          return error;
        });
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.getRefreshToken$.pipe(
      switchMap(() => {
        const accessToken = this.authService.getJwtToken();
        if (accessToken) {
          return next.handle(this.addToken(request, accessToken));
        }

        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
