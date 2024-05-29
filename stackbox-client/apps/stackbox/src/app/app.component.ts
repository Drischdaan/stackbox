import { CommonModule } from '@angular/common';
import { Component, Signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { provideIcons } from '@ng-icons/core';
import { lucideSettings, lucideShoppingBasket } from '@ng-icons/lucide';
import { AppBarComponent } from '@stackbox/shared/component-app-bar';
import { AppSidebarComponent } from '@stackbox/shared/component-app-sidebar';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-test',
  template: '<h1>Test</h1>',
})
export class TestComponent {}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-test2',
  template: '<h1>Test 2</h1>',
})
export class Test2Component {}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, AppBarComponent, AppSidebarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [provideIcons({ lucideShoppingBasket, lucideSettings })],
})
export class AppComponent {
  isAuthenticated: Signal<boolean | undefined> = toSignal(
    this.authService.isAuthenticated$
  );

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const result: boolean | undefined = this.isAuthenticated();
      if (result === false) this.authService.loginWithRedirect();
    });
  }
}
