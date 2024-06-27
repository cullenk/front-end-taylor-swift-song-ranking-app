import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Top13SongSlotListComponent } from './components/top-13-song-slot-list/top-13-song-slot-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardNotFoundComponent } from './components/dashboard-not-found/dashboard-not-found.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { DebutRankingComponent } from './components/ranking-lists/debut-ranking/debut-ranking.component';
import { TorturedPoetsDepartmentRankingComponent } from './components/ranking-lists/tortured-poets-department-ranking/tortured-poets-department-ranking.component';

const routes: Routes = [
  {
    path: '', 
    component: UserDashboardComponent, 
    children: [
    { path: 'userHome', component: HomeComponent},
    { path: 'userProfile', component: UserProfileComponent},
    { path: 'top13list', component: Top13SongSlotListComponent},
    { path: 'rankings', component: RankingsComponent },
    { path: 'rankings/debut', component: DebutRankingComponent},
    { path: 'rankings/tortured-poets-department', component: TorturedPoetsDepartmentRankingComponent },
    { path: '', redirectTo: '/user/userProfile', pathMatch: 'full'},
    {path: '**', component: DashboardNotFoundComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
