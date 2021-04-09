import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PremiumPage } from './premium.page';
import { PartnerPage } from './partner/partner.page'

const routes: Routes = [
  {
    path: '',
    component: PremiumPage
  },
  {
    path: 'partner',
    component: PartnerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PremiumPage,
    PartnerPage
  ]
})
export class PremiumPageModule {}
