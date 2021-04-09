import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListeningPage } from './listening.page';

const routes: Routes = [
  {
    path: '',
    // component: ListeningPage,
    children: [
      {
        path: 'albuns',
        loadChildren: './albuns/albuns.module#AlbunsPageModule'
      },
      {
        path: 'files',
        loadChildren: './files/files.module#FilesPageModule'
      },
      {
        path: 'player',
        component: ListeningPage,
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListeningPage]
})
export class ListeningPageModule {}
