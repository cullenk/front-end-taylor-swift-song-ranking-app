import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
// import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouteGuard } from './services/route-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  //Below is for lazy loading
  {
    path: 'user',
    canActivate: [RouteGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: NotFoundComponent },
];
