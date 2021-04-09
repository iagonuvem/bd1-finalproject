import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsPage } from './notifications.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
