import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettingsPage implements OnInit {

  userData:any;
  appSettings:any;
  settingsForm: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private server: ServerService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private storage: Storage
  ) { 
    this.storage.get('userData').then(async (userData) => {
      // console.log(userData);
      this.userData = userData;
        const alert = await this.alertCtrl.create({
          header: 'Digite sua senha para continuar',
          inputs: [
            {
              name: 'password',
              type: 'password',
              placeholder: 'Digite sua senha'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.modalCtrl.dismiss();
              }
            }, {
              text: 'Ok',
              handler: (data) => {
                this.userData['password'] = data.password;
                this.getSettings();
              }
            }
          ]
        });
    
      await alert.present();
    })
    this.settingsForm = this.formBuilder.group({
      instagram_access_token: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }
  
  async getSettings(){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto buscamos as configurações'
    });
    await loading.present();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    let data = {
      "cpf": this.userData['cpf'], 
      "password": this.userData['password'],
      "api_key": this.userData['api_key'],
      "access_type": this.userData['access_type']
    }

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+'/settings/get',  
      data,
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      // console.log(response);
      if(response['success'] == false){
        const toast = await this.toastCtrl.create({
          message: response['msg'],
          duration:2000,
          position: 'top'
        });
        toast.present();

        setTimeout(() => {
          this.modalCtrl.dismiss();
        }, 2000);
      }else{
        this.appSettings = response;
        this.storage.set('app_settings', response);
        this.settingsForm.get('instagram_access_token').setValue(response['instagram_access_token']);
      }
      await loading.dismiss();
    });
  }

  async send(){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    var endPoint = "/settings/update";
    let data = {
      "_id": this.appSettings['_id'],
      "cpf": this.userData['cpf'], 
      "password": this.userData['password'],
      "api_key": this.userData['api_key'],
      "access_type": this.userData['access_type'],
      "instagram_access_token": this.settingsForm.get('instagram_access_token').value
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
        // this.getSettings();
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
}
