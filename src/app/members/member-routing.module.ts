import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'menu', 
    pathMatch: 'full' 
  },
  {
    path: 'menu', 
    loadChildren: './menu/menu.module#MenuPageModule' 
  },
  { path: 'classes', loadChildren: './classes/classes.module#ClassesPageModule' },
  { path: 'class', loadChildren: './class/class.module#ClassPageModule' },
  { path: 'coordinators', loadChildren: './modals/coordinators/coordinators.module#CoordinatorsPageModule' },
  { path: 'app-settings', loadChildren: './modals/app-settings/app-settings.module#AppSettingsPageModule' },
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
