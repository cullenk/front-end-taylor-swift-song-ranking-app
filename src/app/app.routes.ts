import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
// import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouteGuard } from './services/route-guard';
import { CreateAccountComponent } from './components/create-account/create-account.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'create-account', component: CreateAccountComponent },
  //Below is for lazy loading
  {
    path: 'user',
    canActivate: [RouteGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: NotFoundComponent },
];
