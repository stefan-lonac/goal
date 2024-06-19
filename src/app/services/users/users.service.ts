import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from 'src/app/environments/env.const';
import { UsersResponse } from './model/users.interface';
import { UpdateUserResponse } from './model/update-user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);

  constructor() {}

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
      .get(getCurrentUserUrl)
      .pipe(map((response) => response as UsersResponse));
  }

  public updateCurrentUser(
    udpateUserData: UpdateUserResponse,
  ): Observable<Object> {
    const updateCurrentUserUrl = `${environment.apiBaseUrl}User`;
    return this._http
      .put(updateCurrentUserUrl, udpateUserData)
      .pipe(map((response) => response));
  }

  public getUserByID(id: number): Observable<Object> {
    const updateCurrentUserUrl = `${environment.apiBaseUrl}User/get/${id}`;
    return this._http.get(updateCurrentUserUrl);
  }
}
