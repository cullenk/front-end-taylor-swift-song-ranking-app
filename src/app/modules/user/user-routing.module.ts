import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Top13SongSlotListComponent } from './components/top-13-song-slot-list/top-13-song-slot-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardNotFoundComponent } from './components/dashboard-not-found/dashboard-not-found.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { AlbumRankingComponent } from './components/ranking-lists/album-ranking/album-ranking.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { ErasTourBuilderComponent } from './components/eras-tour-builder/eras-tour-builder.component';
import { AboutComponent } from './components/about/about.component';
import { AllAlbumsRankingComponent } from './components/ranking-lists/all-albums-ranking/all-albums-ranking.component';
import { ContactComponent } from './components/contact/contact.component';
import { UserExplorerComponent } from './components/user-explorer/user-explorer.component';
import { RankByTrackComponent } from './components/ranking-lists/rank-by-track/rank-by-track.component';
import { ReleaseNotesComponent } from './components/release-notes/release-notes.component';
import { AllSongsRankingComponent } from './components/ranking-lists/all-songs/all-songs-ranking.component';
import { AllFavoriteSongsComponent } from './components/all-favorite-songs/all-favorite-songs.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    children: [
      { path: 'userHome', component: HomeComponent },
      { path: 'topRankedSongs', component: AllFavoriteSongsComponent },
      { path: 'about', component: AboutComponent },
      { path: 'userProfile', component: UserProfileComponent },
      { path: 'top13list', component: Top13SongSlotListComponent },
      { path: 'erasTourBuilder', component: ErasTourBuilderComponent },
      { path: 'userExplorer', component: UserExplorerComponent },
      
      // Individual album routes - full page experience
      { path: 'rankings/album/:albumId', component: AlbumRankingComponent },
      
      // Special ranking routes - full page experience
      { path: 'rankings/allAlbums', component: AllAlbumsRankingComponent },
      { path: 'rankings/allSongs', component: AllSongsRankingComponent },
      { path: 'rankings/byTrackNumber', component: RankByTrackComponent },
      
      // Rankings overview page (album grid)
      { path: 'rankings', component: RankingsComponent },
      
      { path: 'contact', component: ContactComponent },
      { path: 'releaseNotes', component: ReleaseNotesComponent },
      { path: '', redirectTo: '/user/userProfile', pathMatch: 'full' },
      { path: '**', component: DashboardNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
