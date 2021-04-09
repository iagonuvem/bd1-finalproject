import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
// import { StudentDataPage } from './student-data.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: StudentDataPage
  // }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [
    // StudentDataPage
  ]
})
export class StudentDataPageModule {}
