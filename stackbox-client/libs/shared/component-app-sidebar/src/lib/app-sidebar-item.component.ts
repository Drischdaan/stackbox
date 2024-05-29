import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { IRouteWithMetadata } from '@stackbox/shared/utils-router';

@Component({
  selector: 'stackbox-app-sidebar-item',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterModule],
  templateUrl: './app-sidebar-item.component.html',
  styleUrl: './app-sidebar-item.component.scss',
})
export class AppSidebarItemComponent {
  route = input.required<IRouteWithMetadata>();
  isActive = input<boolean>(false);

  getRoutePath(route: IRouteWithMetadata): string {
    return route.path ?? '';
  }

  getRouteIcon(route: IRouteWithMetadata): string {
    return route.icon ?? '';
  }

  getRouteName(route: IRouteWithMetadata): string {
    return route.name ?? 'Unnamed';
  }
}
