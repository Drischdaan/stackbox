import { IRouteWithMetadata } from '@stackbox/shared/utils-router';
import { Test2Component, TestComponent } from './app.component';

export const appRoutes: IRouteWithMetadata[] = [
  {
    name: 'Test2',
    icon: 'lucideShoppingBasket',
    path: '',
    component: Test2Component,
  },
  {
    name: 'Settings',
    icon: 'lucideSettings',
    alignment: 'bottom',
    path: 'settings',
    component: TestComponent,
  },
];
