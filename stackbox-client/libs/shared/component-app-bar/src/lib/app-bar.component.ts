import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'stackbox-app-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
})
export class AppBarComponent {
  user$ = this.authService.user$;

  constructor(private readonly authService: AuthService) {}
}
