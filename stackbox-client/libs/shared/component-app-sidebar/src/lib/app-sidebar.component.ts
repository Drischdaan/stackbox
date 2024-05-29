import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import {
  IRouteWithMetadata,
  ROUTER_METADATA,
  SidebarAlignment,
} from '@stackbox/shared/utils-router';
import { AppSidebarItemComponent } from './app-sidebar-item.component';

@Component({
  selector: 'stackbox-app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    RouterModule,
    AppSidebarItemComponent,
  ],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss',
})
export class AppSidebarComponent {
  constructor(
    @Inject(ROUTER_METADATA) public readonly routes: IRouteWithMetadata[],
    private readonly router: Router
  ) {}

  filterInvalidRoutes(routes: IRouteWithMetadata[]): IRouteWithMetadata[] {
    return routes.filter((route) => route.name && route.icon);
  }

  getRoutesByAlignment(alignment: SidebarAlignment) {
    return this.filterInvalidRoutes(this.routes).filter(
      (route) => this.getRouteAlignment(route) === alignment
    );
  }

  getRouteAlignment(route: IRouteWithMetadata): SidebarAlignment {
    return route.alignment ?? 'top';
  }

  isActiveRoute(route: IRouteWithMetadata): boolean {
    return this.router.url === '/' + (route.path ?? '');
  }
}
