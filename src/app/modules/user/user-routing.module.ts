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
import { FearlessRankingComponent } from './components/ranking-lists/fearless-ranking/fearless-ranking.component';
import { SpeakNowRankingComponent } from './components/ranking-lists/speak-now-ranking/speak-now-ranking.component';
import { RedRankingComponent } from './components/ranking-lists/red-ranking/red-ranking.component';
import { NineteenEightyNineRankingComponent } from './components/ranking-lists/nineteen-eighty-nine-ranking/nineteen-eighty-nine-ranking.component';
import { ReputationRankingComponent } from './components/ranking-lists/reputation-ranking/reputation-ranking.component';
import { LoverRankingComponent } from './components/ranking-lists/lover-ranking/lover-ranking.component';
import { FolkloreRankingComponent } from './components/ranking-lists/folklore-ranking/folklore-ranking.component';
import { EvermoreRankingComponent } from './components/ranking-lists/evermore-ranking/evermore-ranking.component';
import { MidnightsRankingComponent } from './components/ranking-lists/midnights-ranking/midnights-ranking.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { ErasTourBuilderComponent } from './components/eras-tour-builder/eras-tour-builder.component';

const routes: Routes = [
  {
    path: '', 
    component: UserDashboardComponent, 
    children: [
    { path: 'userHome', component: HomeComponent},
    { path: 'userProfile', component: UserProfileComponent},
    { path: 'top13list', component: Top13SongSlotListComponent},
    { path: 'erasTourBuilder', component: ErasTourBuilderComponent},
    { path: 'rankings', component: RankingsComponent },
    { path: 'rankings/debut', component: DebutRankingComponent},
    { path: 'rankings/fearless', component: FearlessRankingComponent },
    { path: 'rankings/speak-now', component: SpeakNowRankingComponent },
    { path: 'rankings/red', component: RedRankingComponent },
    { path: 'rankings/nineteen-eighty-nine', component: NineteenEightyNineRankingComponent },
    { path: 'rankings/reputation', component: ReputationRankingComponent },
    { path: 'rankings/lover', component: LoverRankingComponent },
    { path: 'rankings/folklore', component: FolkloreRankingComponent },
    { path: 'rankings/evermore', component: EvermoreRankingComponent },
    { path: 'rankings/midnights', component: MidnightsRankingComponent },
    { path: 'rankings/tortured-poets-department', component: TorturedPoetsDepartmentRankingComponent },
    { path: '', redirectTo: '/user/userProfile', pathMatch: 'full'},
    {path: '**', component: DashboardNotFoundComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
