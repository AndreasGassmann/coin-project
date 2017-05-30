import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { ShowComponent } from './show/show.component';
import { SeasonComponent } from './season/season.component';
import { EpisodeComponent } from './episode/episode.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'show/:id',
        component: ShowComponent
      },
      {
        path: 'show/:id/season/:seasonId',
        component: SeasonComponent
      },
      {
        path: 'show/:id/season/:seasonId/episode/:episodeId',
        component: EpisodeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
