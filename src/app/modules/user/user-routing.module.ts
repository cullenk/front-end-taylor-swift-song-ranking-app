import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Top13SongSlotListComponent } from './components/top-13-song-slot-list/top-13-song-slot-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '', 
    component: UserDashboardComponent, 
    children: [
    { path: 'userHome', component: HomeComponent},
    { path: 'userProfile', component: UserProfileComponent},
    { path: 'top13list', component: Top13SongSlotListComponent},
    { path: '', redirectTo: '/user/userProfile', pathMatch: 'full'},
    // {path: '**', component: NotFoundComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
