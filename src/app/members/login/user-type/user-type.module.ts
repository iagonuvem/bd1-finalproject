import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// import { UserTypePage } from './user-type.page';

const routes: Routes = [
  {
    // path: '',
    // component: UserTypePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [UserTypePage]
})
export class UserTypePageModule {}
