import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }
  
  /**
   * Inicialização do APP (Primeiras funções a se executar)
   */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#29b791')
      this.statusBar.styleLightContent();
      this.authService.authenticationState.subscribe(state => {
        if(state){
          this.navCtrl.navigateRoot(['members', 'menu']);
          // this.splashScreen.hide();StatusBar.styleLightContent();
        }
        else{
          this.navCtrl.navigateRoot(['login']);
          // this.splashScreen.hide();
        }
      });
    });
  }
}
