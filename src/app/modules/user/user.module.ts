import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../services/auth-interceptor';
import { LoadingInterceptor } from '../../services/loading.interceptor'; 
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    DragDropModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true} 
  ],
})
export class UserModule { }