import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouteGuard } from './services/route-guard';
import { PublicProfileComponent } from './modules/user/components/public-profile/public-profile.component';
import { ShareSetlistComponent } from './modules/user/components/share-set-list/share-set-list.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PublicHomeComponent } from './components/public-home/public-home.component';
import { AboutComponent } from './components/about/about.component'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'home', component: PublicHomeComponent }, 
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'reset-password/:token', component: PasswordResetComponent },
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
