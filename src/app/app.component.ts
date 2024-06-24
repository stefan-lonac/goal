import { Component, OnInit, inject } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { RouteDataService } from './services/route-data/route-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private routeDataService = inject(RouteDataService);
  protected showHeader$!: Observable<boolean>;
  protected title = 'goal';

  ngOnInit() {
    this.showHeader$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.routeDataService.getRouteData()['showHeader'] !== false),
    );
  }
}
