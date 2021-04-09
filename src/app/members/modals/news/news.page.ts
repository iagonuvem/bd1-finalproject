import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController, AlertController, LoadingController, Platform} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Base64 } from '@ionic-native/base64/ngx';
import { Socket } from 'ngx-socket-io';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  newsForm:FormGroup;
  news:any = [];
  imgPath:any = null;
  imgBase64:any = null;
  userData:any;
  loadingNews:any = true;
  editingNewsId: any;

  constructor(private storage: Storage,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private server: ServerService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private socket: Socket,
    private base64: Base64,
    private fileChooser: FileChooser,
    private file: File,
    private filePath: FilePath,
    private webview: WebView,
    private camera: Camera,
    private platform: Platform,
    private domSanitizer: DomSanitizer) {
      this.newsForm = this.formBuilder.group({
        // api_key: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        short_desc: new FormControl('', Validators.required),
        full_desc: new FormControl('', Validators.required),
        // file: new FormControl('', Validators.required)
      });

      this.storage.get('userData').then((userData) => {
        this.userData = userData;
        this.getNewsData();
      })
    }

  ngOnInit() {
    
  }

  getNewsData(){
    this.news = [];
    this.loadingNews = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/news/getAllByUnit", 
      {
        'api_key': this.userData['api_key']
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      this.loadingNews = false;
      if(response['ok'] == 0){
        this.presentToast(response['msg']);
      }else{
        this.news = response;
      }
    });
  }

  edit(news){
    console.log(news);
    this.editingNewsId = news['_id'];
    this.newsForm.get('title').setValue(news['title']);
    this.newsForm.get('short_desc').setValue(news['short_desc']);
    this.newsForm.get('full_desc').setValue(news['full_desc']);

  }
  
  async confirmDelete(news){
    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente excluir?!',
      message: 'Essa ação não poderá ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Deletar',
          handler: () => {
            this.deleteNews(news);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteNews(news){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/news/delete", 
      {'_id': news._id}, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      this.getNewsData();
      const toast = await this.toastCtrl.create({
        message: response['msg'],
        duration:2000,
        position: 'top'
      });
      await loading.dismiss();
      toast.present();
    });
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

  async uploadFile(){
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, 'img-news');
            
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, 'img-news');
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

  updateStoredImages(name){
    var filePath = this.file.dataDirectory + name;
    this.imgPath = this.pathForImage(filePath);

    this.base64.encodeFile(filePath).then((base64File: string) => {
      this.imgBase64 = base64File;
    }, (err) => {
      // this.presentToast('Erro ao armazenar imagem');
    });
  }

  async send(){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    var endPoint = "/news/insert";
    let data = {
      "title": this.newsForm.get('title').value,
      "short_desc": this.newsForm.get('short_desc').value,
      "full_desc": this.newsForm.get('full_desc').value,
      "img": await this.getBase64Data(this.imgBase64),
      "api_key": this.userData['api_key'],
      "user_name" : this.userData['name'],
      "user_id": this.userData['_id']
    }

    if(this.editingNewsId){
      data['_id'] = this.editingNewsId;
      endPoint = "/news/update";
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+endPoint, 
      data, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      if(response['success'] == true){
        this.imgBase64 = null;
        this.editingNewsId = null;
        this.newsForm.reset();
        data['description'] = data['short_desc'];
        data['news'] = true;
        this.emitGlobalNotification(data);
        this.getNewsData();
      }
      const toast = await this.toastCtrl.create({
        message: response['msg'],
        duration:2000,
        position: 'top'
      });
      await loading.dismiss();
      toast.present();
    });
  } 

  emitGlobalNotification(data){
    this.socket.connect();

    this.socket.emit('globalNotification',data);
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  getImgBase64(base64data){
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/*;base64,'+base64data);
  }

  getBase64Data(fullBase64){
    if(fullBase64){
      return fullBase64.split(',')[1];
    }
    return null;
  }
}
