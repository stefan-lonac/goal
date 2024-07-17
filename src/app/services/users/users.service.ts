import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/app/environments/env.const';
import { AuthService } from '../auth/auth.service';
import { UpdateUserResponse } from './model/update-user.interface';
import { UsersResponse } from './model/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);
  private authService = inject(AuthService);
  private _currentUser$ = new BehaviorSubject<UsersResponse | null>(null);

  get currentUser$(): Observable<UsersResponse | null> {
    if (this.authService.isLoggedIn) {
      this.getCurrentUser().subscribe();
    }
    return this._currentUser$.asObservable();
  }

  public getUsers(): Observable<UsersResponse[]> {
    const usersUrl = `${environment.apiBaseUrl}User/getAll`;
    return this._http.get(usersUrl).pipe(
      map((response) => {
        return response as UsersResponse[];
      }),
    );
  }

  public getCurrentUser(): Observable<UsersResponse> {
    const getCurrentUserUrl = `${environment.apiBaseUrl}User/getCurrent`;
    return this._http
      .get<UsersResponse>(getCurrentUserUrl)
      .pipe(tap((user) => this._currentUser$.next(user)));
  }

  public updateCurrentUser(
    udpateUserData: UpdateUserResponse,
  ): Observable<Object> {
    const updateCurrentUserUrl = `${environment.apiBaseUrl}User`;
    return this._http.put(updateCurrentUserUrl, udpateUserData).pipe(
      switchMap(() => this.getCurrentUser()),
      tap((updateUser) => this._currentUser$.next(updateUser as UsersResponse)),
    );
  }

  public getUserByID(id: number): Observable<Object> {
    const updateCurrentUserUrl = `${environment.apiBaseUrl}User/get/${id}`;
    return this._http.get(updateCurrentUserUrl);
  }
}
