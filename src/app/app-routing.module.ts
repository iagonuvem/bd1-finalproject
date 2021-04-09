import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
  { 
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadChildren: './members/login/login.module#LoginPageModule'
  },
  { 
    path: 'user-type', 
    loadChildren: './members/login/user-type/user-type.module#UserTypePageModule' 
  },
  { 
    path: 'authentication', 
    loadChildren: './members/login/authentication/authentication.module#AuthenticationPageModule' 
  },
  {
    path: 'members',
    canActivate: [AuthGuard],
    loadChildren: './members/member-routing.module#MemberRoutingModule'
  },
  { path: 'exercises-public', loadChildren: './exercises-public/exercises-public.module#ExercisesPublicPageModule' }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
