import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map, share, tap } from 'rxjs';
import { environment } from 'src/app/environments/env.const';
import { LoginResponse } from './model/login.interface';
import { RegistrationResponse } from './model/registration.interface';
import { Router } from '@angular/router';
import { TokenNames } from './const/token.const';
import { TokenResponse } from './model/token-response.interface';
import { UsersResponse } from '../users/model/users.interface';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private router = inject(Router);
  private _token$: Observable<void> | null = null;
  private readonly tokenNames = TokenNames;
  private jwtToken!: string | null;
  private refreshToken!: string | null;
  protected loggedUser?: string | null;

  constructor() {
    this.jwtToken = localStorage.getItem(this.tokenNames.JWT_TOKEN);
    this.refreshToken = localStorage.getItem(this.tokenNames.REFRESH_TOKEN);
  }

  public get getRefreshToken$(): Observable<void> {
    if (!this._token$) {
      this._token$ = this.refreshAccessToken().pipe(
        share(),
        finalize(() => {
          this._token$ = null;
        }),
        map((response) => {
          this.jwtToken = response.jwtToken;
        }),
      );
    }

    return this._token$;
  }

  public get _authToken(): string {
    return this.refreshToken || '';
  }

  public get _jwtToken(): string {
    return this.jwtToken || '';
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
    return !!this._jwtToken;
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
    return this.jwtToken;
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

  public removeTokens() {
    this.jwtToken = null;
    this.refreshToken = null;
    localStorage.removeItem(this.tokenNames.JWT_TOKEN);
    localStorage.removeItem(this.tokenNames.REFRESH_TOKEN);
  }

  private storeTokens(tokens: any) {
    this.jwtToken = tokens.jwtToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem(this.tokenNames.JWT_TOKEN, tokens.jwtToken);
    localStorage.setItem(this.tokenNames.REFRESH_TOKEN, tokens.refreshToken);
  }

  private doLoginUser(email?: string, tokens?: any) {
    this.loggedUser = email;
    this.storeTokens(tokens);
  }
}
