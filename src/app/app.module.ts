import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonInfiniteScroll } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DatePipe } from '@angular/common';
import { HTTP } from '@ionic-native/http/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx' 
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

// MODALS & POPOVERS
import { StudentDataPageModule } from './members/modals/student-data/student-data.module';
import { ClassChatPageModule } from './members/modals/class-chat/class-chat.module';
import { PopoverFinancialComponent } from './members/modals/popover-financial/popover-financial.component';
import { UserQrPageModule } from './members/modals/user-qr/user-qr.module'
import { FeedbacksPageModule } from './members/modals/feedbacks/feedbacks.module';
import { NotificationsPageModule } from './members/modals/notifications/notifications.module';
import { NewsPageModule } from './members/modals/news/news.module';
import { EventsPageModule } from './members/modals/events/events.module';
import { ExercisesPageModule } from './members/modals/exercises/exercises.module';
import { CoordinatorsPageModule } from './members/modals/coordinators/coordinators.module'; 
import { AppSettingsPageModule } from './members/modals/app-settings/app-settings.module'
import { SetTutoringPageModule } from './members/modals/set-tutoring/set-tutoring.module';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { Media } from '@ionic-native/media/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx'
import { FilePath } from '@ionic-native/file-path/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ServerService } from 'src/app/services/server.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

let server: ServerService = new ServerService();
let config: SocketIoConfig = { 
  url: server.protocol+server.host+server.webSocketsPort, 
  // url: 'http://seedidiomas-com.umbler.net:80',
  options: {} 
};

@NgModule({
  declarations: [
    AppComponent,
    PopoverFinancialComponent
  ],
  entryComponents: [
    PopoverFinancialComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config),
    HttpClientModule,
    StudentDataPageModule,
    ClassChatPageModule,
    UserQrPageModule,
    FeedbacksPageModule,
    NotificationsPageModule,
    NewsPageModule,
    EventsPageModule,
    CoordinatorsPageModule,
    ExercisesPageModule,
    AppSettingsPageModule,
    SetTutoringPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    SocialSharing,
    Contacts,
    Clipboard,
    LocalNotifications,
    Media,
    Camera,
    WebView,
    File,
    FilePath,
    FileTransfer,
    FileTransferObject,
    DatePipe,
    Base64,
    FileChooser,
    GooglePlus,
    AppAvailability,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
