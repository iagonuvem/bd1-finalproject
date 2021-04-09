import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoordinatorsPage } from './coordinators.page';

const routes: Routes = [
  {
    path: '',
    component: CoordinatorsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoordinatorsPage]
})
export class CoordinatorsPageModule {}
