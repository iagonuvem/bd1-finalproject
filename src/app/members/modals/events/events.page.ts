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
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  eventsForm:FormGroup;
  events:any = [];
  imgPath:any = null;
  imgBase64:any = null;
  userData:any;
  loadingEvents:any = true;
  editingEventId: any;
  
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
      this.eventsForm = this.formBuilder.group({
        location_text: new FormControl('', Validators.required),
        date: new FormControl('', Validators.required),
        hour: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        short_desc: new FormControl('', Validators.required),
        full_desc: new FormControl('', Validators.required),
        // file: new FormControl('', Validators.required)
      });

      this.storage.get('userData').then((userData) => {
        this.userData = userData;
        this.getEventsData();
      })
    }

  ngOnInit() {
    
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

  getEventsData(){
    this.events = [];
    this.loadingEvents = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/events/getAllByUnit", 
      {
        'api_key': this.userData['api_key']
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      this.loadingEvents = false;
      if(response['ok'] == 0){
        this.presentToast(response['msg']);
      }else{
        this.events = response;
      }
    });
  }

  edit(event){
    console.log(event);
    this.editingEventId = event['_id'];
    this.eventsForm.get('location_text').setValue(event['location'].text);
    this.eventsForm.get('date').setValue(event['date']);
    this.eventsForm.get('hour').setValue(event['date']);
    this.eventsForm.get('title').setValue(event['title']);
    this.eventsForm.get('short_desc').setValue(event['short_desc']);
    this.eventsForm.get('full_desc').setValue(event['full_desc']);

  }

  async send(){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    var date = new Date(this.eventsForm.get('date').value);
    var hour = new Date(this.eventsForm.get('hour').value);
    date.setHours(hour.getHours());
    date.setMinutes(hour.getMinutes());

    var endPoint = "/events/insert";
    let data = {
      "date": date, 
      "title": this.eventsForm.get('title').value,
      "short_desc": this.eventsForm.get('short_desc').value,
      "full_desc": this.eventsForm.get('full_desc').value,
      "location_text": this.eventsForm.get('location_text').value,
      "img": this.getBase64Data(this.imgBase64),
      "api_key": this.userData['api_key'],
      "user_name" : this.userData['name'],
      "user_id": this.userData['_id']
    }

    if(this.editingEventId){
      data['_id'] = this.editingEventId;
      endPoint = "/events/update";
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
        this.editingEventId = null;
        this.eventsForm.reset();
        data['description'] = data['short_desc'];
        data['news'] = true;
        this.emitGlobalNotification(data);
        this.getEventsData();
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

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  emitGlobalNotification(data){
    this.socket.connect();

    this.socket.emit('globalNotification',data);
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

  getBase64Data(fullBase64){
    return fullBase64.split(',')[1];
  }
}
