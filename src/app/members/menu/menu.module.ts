import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { StudentDataPage } from '../modals/student-data/student-data.page';
import { BrMaskerModule } from 'br-mask';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'master',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: './../home/home.module#HomePageModule'
      },
      {
        path: 'classes',
        loadChildren: './../classes/classes.module#ClassesPageModule'
      },
      {
        path: 'class',
        loadChildren: './../class/class.module#ClassPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'master/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    BrMaskerModule,
    ReactiveFormsModule
  ],
  declarations: [
    MenuPage,
    StudentDataPage
  ],
  entryComponents: [
    StudentDataPage
  ],
  exports: [
    StudentDataPage
  ]
})
export class MenuPageModule {}
