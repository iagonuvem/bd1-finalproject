import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ServerService } from 'src/app/services/server.service';
import { Socket } from 'ngx-socket-io';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { InstaService } from 'src/app/services/insta.service';
import { CoreService } from 'src/app/services/core.service';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers:[
    InstaService,
    CoreService
  ]
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  backButtonSubscription;
  userData = {};
  noNews = true;
  notifications:any = [];
  scores = {};
  public lista_feed: any;
  
 
  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private server: ServerService,
    private socket: Socket,
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private coreService: CoreService,
    private InstaService: InstaService,
    private appAvailability: AppAvailability,
    private inAppBrowser: InAppBrowser
  ) { 
    this.socket.connect();
    
    this.socket.fromEvent('newNotification').subscribe((data) => {
      // console.log(data);
      if(data["api_key"] == this.userData["api_key"]){
        this.notifications.push(data);
        this.storage.set('notifications', this.notifications);
        if(data["trigger"] != undefined && data["trigger"] != '' && data["trigger"] != null){
          this.localNotifications.schedule({
            id: 1,
            title: data["title"],
            smallIcon : 'file://assets/resources/icon-small.png',
            icon: 'file://assets/resources/icon.png',
            text: data["msg"],
            sound: 'file://assets/resources/sounds/when.mp3',
            trigger: data['trigger']
          });
        }
        else{
          this.localNotifications.schedule({
            id: 1,
            title: data["title"],
            smallIcon : 'file://assets/resources/icon-small.png',
            icon: 'file://assets/resources/icon.png',
            text: data["msg"],
            sound: 'file://assets/resources/sounds/when.mp3'
          });
        }

        
        if(this.notifications != []){
          this.noNews = false;
        }
      }
    });
    
    this.storage.get('notifications').then((notifications) => {
      if(notifications){
        this.noNews = false;
        this.notifications = notifications;
      }
    })

    this.storage.get('userData').then(async (userData) => {
      this.userData = userData;
      var settings = await this.coreService.getSettings(this.userData['_id']);
      this.splashScreen.hide();

      await this.InstaService.setApiKey(settings['instagram_access_token']);
      this.InstaService.getInstaContent().subscribe(
        data=>{
            const response = (data as any);
            this.lista_feed = response.data;
            // console.log(response);
        },error=>{
              console.log(error);
        }
      )

      if(this.isStudent()){
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-type':  this.server.headers["Content-type"],
            'Accept': this.server.headers["Content-type"],
            'api_key': this.userData["api_key"]
          })
        };
       
        /** Faz Chamada apenas para ultima turma no objeto */
        this.http.post(
          this.server.sponteURL+'scores', 
          {
            student_id: this.userData["student_id"],
            class_id: this.userData["registrations"][this.userData["registrations"].length - 1].class_id,
            phase_id: this.userData["registrations"][this.userData["registrations"].length - 1].phase_id
          }, 
          httpOptions)
        .pipe(map(res => res)
        ).subscribe(response => {
          this.scores = response;
        });
      }
    });
  }

  async ngOnInit() {
    
  }

  isStudent(){
    return (this.userData['access_type'] == 4);
  }

  isTeacher(){
    return (this.userData['access_type'] == 3);
  }

  initInsta() {
    let app;
    let name = 'seedidiomas';

    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.android';
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.instagram.com/' + name);
      return;
    }

    this.appAvailability.check(app)
        .then(
          (yes: boolean) => {
            // console.log(app + ' is available')
            // Success
            // App exists
            const browser: InAppBrowserObject = this.inAppBrowser.create('instagram://user?username=' + name, '_system');
          },
          (no: boolean) => {
            // Error
            // App does not exist
            // Open Web URL
            const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.instagram.com/' + name, '_system');
          }
        );
    // window.open('instagram://user?username=seedidiomas', '_system');
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  slideOpts2 = {
    spaceBetween: 5,
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2
  };

  toggleMenu() {
    this.menuCtrl.toggle();
  }
  doRefresh(event) {
    this.noNews = false;
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      this.noNews = true;
    }, 2000);
  } 

  navigate(page){
    this.navCtrl.navigateForward('members/menu/master/'+page);
  }
  removeNotification(index){
    this.notifications.splice(index,1);
    this.storage.set('notifications', this.notifications);
    if(this.notifications == []){
      this.noNews = true;
    }
    
  }
  loadNews(event) {
    setTimeout(() => {
      // console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      // if (data.length == 1000) {
      //   event.target.disabled = true;
      // }
    }, 500);
  }
  ngAfterViewInit() {
    
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (window.location.pathname == "/members/menu/master/home") {
        navigator['app'].exitApp();
      }
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
}
