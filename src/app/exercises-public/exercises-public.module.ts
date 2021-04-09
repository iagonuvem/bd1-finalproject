import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExercisesPublicPage } from "./ExercisesPublicPage";

const routes: Routes = [
  {
    path: '',
    component: ExercisesPublicPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ExercisesPublicPage]
})
export class ExercisesPublicPageModule {}
