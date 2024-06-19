import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  share,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/app/environments/env.const';
import { LoginResponse } from './model/login.interface';
import { RegistrationResponse } from './model/registration.interface';
import { Router } from '@angular/router';
import { TokenNames } from './const/token.const';
import { TokenResponse } from './model/token-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private router = inject(Router);
  private _token$: Observable<void> | null = null;
  private readonly tokenNames = TokenNames;
  protected loggedUser?: string | null;
  protected refreshToken!: string;

  public get getRefreshToken$(): Observable<void> {
    if (!this._token$) {
      this._token$ = this.refreshAccessToken().pipe(
        share(),
        finalize(() => {
          this._token$ = null;
        }),
        map(() => {}),
      );
    }

    return this._token$;
  }

  public get _authToken(): string {
    return localStorage.getItem(this.tokenNames.REFRESH_TOKEN)!;
  }

  public login(data: LoginResponse): Observable<boolean> {
    const loginURL = `${environment.apiBaseUrl}Login/login`;
    return this._http
      .post<any>(loginURL, data)
      .pipe(tap((tokens) => this.doLoginUser(data.email, tokens)));
  }

  public logout(): void {
    this.loggedUser = null;
    this.doLogoutUser();
  }

  public isLoggedIn() {
    return !!this.getJwtToken();
  }

  public registration(
    data: RegistrationResponse,
  ): Observable<RegistrationResponse> {
    const registerUrl = `${environment.apiBaseUrl}Register`;
    return this._http
      .post(registerUrl, {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        roles: data.roles,
      })
      .pipe(
        map((response) => {
          return response as RegistrationResponse;
        }),
      );
  }

  public getJwtToken() {
    return localStorage.getItem(this.tokenNames.JWT_TOKEN);
  }

  public doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.router.navigate(['/login']);
  }

  public refreshAccessToken(): Observable<TokenResponse> {
    return this._http
      .post<TokenResponse>(`${environment.apiBaseUrl}Login/refresh`, {
        refreshToken: this._authToken,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response);
        }),
      );
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.tokenNames.JWT_TOKEN, tokens.jwtToken);
    localStorage.setItem(this.tokenNames.REFRESH_TOKEN, tokens.refreshToken);
  }

  private doLoginUser(email?: string, tokens?: any) {
    this.loggedUser = email;
    this.storeTokens(tokens);
  }

  private removeTokens() {
    localStorage.removeItem(this.tokenNames.JWT_TOKEN);
    localStorage.removeItem(this.tokenNames.REFRESH_TOKEN);
  }
}
