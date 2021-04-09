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
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'exercises', loadChildren: './exercises/exercises.module#ExercisesPageModule' },
  { path: 'listening', loadChildren: './listening/listening.module#ListeningPageModule' },
  { path: 'store', loadChildren: './store/store.module#StorePageModule' },
  { path: 'financial', loadChildren: './financial/financial.module#FinancialPageModule' },
  { path: 'class', loadChildren: './class/class.module#ClassPageModule' },
  { path: 'premium', loadChildren: './premium/premium.module#PremiumPageModule' },
  { path: 'partner', loadChildren: './premium/partner/partner.module#PartnerPageModule' },
  { path: 'feedbacks', loadChildren: './modals/feedbacks/feedbacks.module#FeedbacksPageModule' },
  { path: 'notifications', loadChildren: './modals/notifications/notifications.module#NotificationsPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'news', loadChildren: './modals/news/news.module#NewsPageModule' },
  { path: 'events', loadChildren: './modals/events/events.module#EventsPageModule' },
  { path: 'exercises', loadChildren: './modals/exercises/exercises.module#ExercisesPageModule' },
  { path: 'coordinators', loadChildren: './modals/coordinators/coordinators.module#CoordinatorsPageModule' },
  { path: 'app-settings', loadChildren: './modals/app-settings/app-settings.module#AppSettingsPageModule' },
  { path: 'tutoring', loadChildren: './tutoring/tutoring.module#TutoringPageModule' },
  { path: 'set-tutoring', loadChildren: './modals/set-tutoring/set-tutoring.module#SetTutoringPageModule' },

];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
