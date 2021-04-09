import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { NavController, ModalController, MenuController, Platform, ToastController, LoadingController } from '@ionic/angular';

// MODALS
import { StudentDataPage } from '../modals/student-data/student-data.page'
import { FeedbacksPage } from "../modals/feedbacks/feedbacks.page";
import { NotificationsPage } from "../modals/notifications/notifications.page";
import { NewsPage } from '../modals/news/news.page'
import { EventsPage } from '../modals/events/events.page'
import { ExercisesPage } from '../modals/exercises/exercises.page'
import { CoordinatorsPage } from '../modals/coordinators/coordinators.page'
import { AppSettingsPage } from '../modals/app-settings/app-settings.page'

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";
import { Base64 } from '@ionic-native/base64/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'Início',
      url: 'home'
    },
    {
      title: 'Minhas Turmas',
      url: 'classes'
    },
    {
      title: 'Exercicios',
      url: 'exercises'
    },
    {
      title: 'Listening',
      url: 'listening'
    },
    {
      title: 'Eventos',
      url: 'events'
    },
    {
      title: 'Indique um amigo',
      url: 'discount'
    },
    {
      title: 'Loja Seed',
      url: 'store'
    },
    {
      title: 'Financeiro',
      url: 'financial'
    }
  ]
  SelectedPath = '';
  currentClass = {};
  noCurrentClass = true;
  userData = {};
  userDetails = {
    "score_avg": 0,
    "presence_avg": 0,
    "current_class": "",
    "situation": ""
  }
  httpOptions: any;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  imgPath:any = null;
  imgBase64:any = null;
  firstLogin:any = true;
  showTutorial:any = true;
  constructor(
    private storage: Storage,
    private authService: AuthenticationService,
    private socialSharing: SocialSharing,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private server: ServerService,
    private http: HttpClient,
    private base64: Base64,
    private file: File,
    private filePath: FilePath,
    private webview: WebView,
    private camera: Camera,
    private platform: Platform,
    private domSanitizer: DomSanitizer
  ) {
    // this.storage.get('firstLogin').then((firstLogin) => {
    //   this.firstLogin = firstLogin;
    // });
    this.storage.get('userData').then((userData) => {
      // console.log(userData);
      this.userData = userData;
      if(this.userData['last_login']){
        this.firstLogin = false;
      }

      if(this.isStudent()){
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-type': this.server.headers["Content-type"],
            'api_key': this.userData["api_key"]
          })
        };
        let currentClass = this.userData["registrations"][this.userData["registrations"].length - 1];
        this.http.post(
          this.server.sponteURL + 'scores',
          {
            student_id: this.userData["student_id"],
            class_id: currentClass["class_id"],
            phase_id: currentClass["phase_id"]
          },
          this.httpOptions)
          .pipe(map(res => res)
          ).subscribe(response => {
            // console.log(response);
            this.userDetails.situation = response["situation"];
            var sum = 0;
            for (var i in response["grades"]) {
              sum += (response["grades"][i].score) / (response["grades"][i].maximum_value);
            }
            var avg = sum / response["grades"].length;
            this.userDetails.score_avg = avg;
            var currentMonth = new Date().getMonth() + 1;
            var currentYear = new Date().getFullYear();
            var currentSemester;
            if (currentMonth < 6) {
              currentSemester = '1/' + currentYear.toString();
            }
            else {
              currentSemester = '2/' + currentYear.toString();
            }
            for (var i in this.userData["registrations"]) {
              this.http.post(
                this.server.sponteURL + 'classes',
                {
                  class_id: this.userData["registrations"][i].class_id
                },
                this.httpOptions)
                .pipe(map(res => res)
                ).subscribe(response => {
                  if (response["semester"] == currentSemester.toString()) {
                    this.userDetails.current_class = response["name"];
                  }
                });
            }
        });
      } 
    });
    
    this.router.events.subscribe((event: RouterEvent) => {
      this.SelectedPath = event.url;
    });
  }

  ngOnInit() {

  }

  /**
   * ----------------------------------------------------------
   * FUNÇÕES DE UPLOAD IMAGEM
   * ----------------------------------------------------------
   */

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
    };

    await this.camera.getPicture(options).then(async (imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(async filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            await this.copyFileToLocalDir(correctPath, currentName, 'img-news');     
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        await this.copyFileToLocalDir(correctPath, currentName, 'img-news');
      }
    });
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Erro ao armazenar imagem');
    });
  }

  async updateStoredImages(name){
    var filePath = this.file.dataDirectory + name;
    this.imgPath = this.pathForImage(filePath);

    this.base64.encodeFile(filePath).then(async (base64File: string) => {
      this.imgBase64 = base64File;
      let loading = await this.loadingCtrl.create({
        message: 'Aguarde enquanto salvamos a imagem...'
      });
      await loading.present();
      if(this.imgBase64){
        this.http.post(
          this.server.protocol+this.server.host+this.server.port+'/users/update',
          {
            _id: this.userData["_id"],
            photo: this.getBase64Data(this.imgBase64),
            api_key: this.userData['api_key']
          },
          this.httpOptions)
          .pipe(map(res => res)
          ).subscribe(async response => {
            await loading.dismiss();
            if(response['success']){
              this.userData['photo'] = this.imgBase64
              this.storage.set('userData', this.userData);
            }
            this.presentToast(response['msg']);
          });
      }else{
        await loading.dismiss();
        this.presentToast("Ops.. parece que tivemos algum problema, tente novamente mais tarde.")
      }
    }, (err) => {
      // this.presentToast('Erro ao armazenar imagem');
    });
  }

  /**
   * ----------------------------------------------------------
   * FIM FUNÇÕES UPLOAD IMAGEM
   * ----------------------------------------------------------
   */

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  isStudent(){
    return (this.userData['access_type'] == 4);
  }

  isCoordinator(){
    return (this.userData['access_type'] == 2);
  }

  isAdmin(){
    return (this.userData['access_type'] == 1);
  }

  logout() {
    this.authService.logout();
  }

  async modalStudent() {
    const modal = await this.modalCtrl.create({
      component: StudentDataPage
    });
    return await modal.present();
  }

  async modalFeedback() {
    const modal = await this.modalCtrl.create({
      component: FeedbacksPage
    });
    return await modal.present();
  }

  async modalNotification() {
    const modal = await this.modalCtrl.create({
      component: NotificationsPage
    });
    return await modal.present();
  } 

  async modalNews() {
    const modal = await this.modalCtrl.create({
      component: NewsPage
    });
    return await modal.present();
  }

  async modalEvents() {
    const modal = await this.modalCtrl.create({
      component: EventsPage
    });
    return await modal.present();
  }
  
  async modalExercises() {
    const modal = await this.modalCtrl.create({
      component: ExercisesPage
    });
    return await modal.present();
  }

  async modalCoordinators() {
    const modal = await this.modalCtrl.create({
      component: CoordinatorsPage
    });
    return await modal.present();
  }

  async modalSettings() {
    const modal = await this.modalCtrl.create({
      component: AppSettingsPage
    });
    return await modal.present();
  }

  navigateMenu(page) {
    this.menuCtrl.close();
    this.navCtrl.navigateForward('members/menu/master/' + page);
  }
  
  getBase64Data(fullBase64){
    return fullBase64.split(',')[1];
  }

  getImgBase64(base64data){
    if(base64data.split(',')[0].toString().split(';')[1] == 'base64'){ //Caso venha string completa
      return this.domSanitizer.bypassSecurityTrustUrl(base64data);
    }else{
      return this.domSanitizer.bypassSecurityTrustUrl('data:image/*;base64,'+base64data);
    }
    
  }

  async editPhoto(){
    let loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos a imagem...'
    });

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    try {
      await this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    } catch (error) {
      await loading.dismiss();
      this.presentToast("Ops.. parece que tivemos algum problema, tente novamente mais tarde.")
    }
    
  }
  
  initWpp() {
    var number = '';
    if (this.userData['api_key'] == '0935C4') { number = '5531989357750' } // JM
    if (this.userData['api_key'] == '3264F7') { number = '5531971370055' } // Contagem
    if (this.userData['api_key'] == '068EE5') { number = '5533999930777' } // Caratinga
    let wppAPI = 'https://wa.me/' + number;
    window.open('whatsapp://' + wppAPI, '_system');
    this.socialSharing.shareViaWhatsAppToReceiver(number, 'Olá! Estou precisando de ajuda no aplicativo Seed!', '', '').then(() => {
    })
      .catch((error) => {
        console.log(error);
      })
  }

  skipTutorial(){
    this.showTutorial = false;
    this.storage.set('firstLogin', false).then(() => {
      this.firstLogin = false;
    });
    
  }
}
