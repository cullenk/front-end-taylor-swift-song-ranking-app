import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
// import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouteGuard } from './services/route-guard';
import { PublicProfileComponent } from './modules/user/components/public-profile/public-profile.component';
import { ShareSetlistComponent } from './modules/user/components/share-set-list/share-set-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
{ path: 'public-profile/:username', component: PublicProfileComponent },
{ path: 'share-setlist/:username', component: ShareSetlistComponent },

  
  //Below is for lazy loading
  {
    path: 'user',
    canActivate: [RouteGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: NotFoundComponent },
];
