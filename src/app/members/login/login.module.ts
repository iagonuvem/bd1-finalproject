import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { UserTypePage } from './user-type/user-type.page';
import { AuthenticationPage } from './authentication/authentication.page';
import { BrMaskerModule } from 'br-mask';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'user-type',
    component: UserTypePage
  },
  {
    path: 'authentication',
    component: AuthenticationPage
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
    LoginPage,
    UserTypePage,
    AuthenticationPage
  ]
})
export class LoginPageModule {}
