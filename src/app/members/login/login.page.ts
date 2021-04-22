import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  splash = true;
  backButtonSubscription;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private navCtrl: NavController
    ) {
      this.platform.ready().then(() => {
        this.splashScreen.hide();
        this.authService.authenticationState.subscribe(state => {
          if(state){
            this.splash = true;
          }
          else{
            this.splash = false;
          }
        });
      });
  }

  goToPagePublic(){
    this.navCtrl.navigateForward('/exercises-public');
  }
  
  goUserType(unit){
    // SET API Sponte Key
    if(unit == 'jm'){
      unit = '0935C4';
    }
    if(unit == 'contagem'){
      unit = '3264F7';
    }
    if(unit == 'caratinga'){
      unit = '068EE5';
    }
    let navigationExtras: NavigationExtras = {
      state: {
        api_key: unit,
        userType: parseInt('2')
      }
    };
    this.router.navigate(['login/authentication'], navigationExtras);
  }
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (window.location.pathname == "/login") {
        navigator['app'].exitApp();
      }
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }


}
