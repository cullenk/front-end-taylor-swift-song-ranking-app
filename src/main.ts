import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { UserModule } from './app/modules/user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';

const updatedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(UserModule, HttpClientModule)
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));
