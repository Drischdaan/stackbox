import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';

export type SidebarAlignment = 'top' | 'bottom';

export interface IRouteWithMetadata extends Route {
  name?: string;
  icon?: string;
  alignment?: SidebarAlignment;
}

export const ROUTER_METADATA = new InjectionToken<IRouteWithMetadata>(
  'ROUTER_METADATA'
);
