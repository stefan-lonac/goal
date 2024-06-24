import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  private activateRoute = inject(ActivatedRoute);

  public getRouteData() {
    let route = this.activateRoute.firstChild;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.snapshot.data || {};
  }
}
