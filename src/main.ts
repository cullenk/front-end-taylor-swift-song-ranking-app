import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { UserModule } from './app/modules/user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app/app.routes';

const updatedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(UserModule, HttpClientModule),
    provideCharts(withDefaultRegisterables()),
    provideRouter(routes, withPreloading(PreloadAllModules)) // Use withPreloading to specify preloading strategy
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));