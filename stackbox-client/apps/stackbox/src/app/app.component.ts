import { CommonModule } from '@angular/common';
import { Component, Signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { AppBarComponent } from '@stackbox/shared/component-app-bar';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, AppBarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
