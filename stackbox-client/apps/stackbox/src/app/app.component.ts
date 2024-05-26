import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AppService,
  GetHealthCheck200Response,
} from '@stackbox/shared/api-stackbox';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly appService: AppService = inject(AppService);

  healthCheck$: Observable<GetHealthCheck200Response> =
    this.appService.getHealthCheck();
}
