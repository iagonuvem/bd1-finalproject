import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { IonicModule } from '@ionic/angular';

import { UserQrPage } from './user-qr.page';

const routes: Routes = [
  {
    path: '',
    component: UserQrPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserQrPage]
})
export class UserQrPageModule {}
