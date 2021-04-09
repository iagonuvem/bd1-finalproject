import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  userData:any;
  notificationForm:FormGroup;
  recurrent:any = {
    type:''
  }
  notifications:any = [];
  constructor(private storage: Storage,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private server: ServerService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private socket: Socket) {
      this.notificationForm = this.formBuilder.group({
        api_key: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        msg: new FormControl('', Validators.required),
        date: new FormControl(''),
        time: new FormControl(''),
        recurrent: new FormControl(false, Validators.required)
      });
      
      this.storage.get('userData').then((userData) => {
        this.userData = userData;
        if(userData['access_type'] > 2){ // PROFESSOR ou ALUNO ou RESPONSÁVEL
          this.modalCtrl.dismiss();
        }

        // TEMPORÁRIO
        this.notificationForm.get('api_key').setValue(this.userData['api_key']);
        this.getNotificationsData();
      })
  }

  ngOnInit() {
    
  }

  emitGlobalNotification(data){
    this.socket.connect();

    this.socket.emit('globalNotification',data);
  }
  
  getNotificationsData(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/notifications/getByUnit", 
      {
        'api_key': this.userData['api_key']
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      if(response['ok'] == 0){
        const toast = await this.toastCtrl.create({
          message: response['msg'],
          duration:2000, 
          position:'top'
        });
        toast.present();
      }else{
        this.notifications = response;
      }
    });
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

  async confirmDelete(notification) {
    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente excluir?!',
      message: 'Ao deletar novos alunos não receberão mais essa mensagem',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Deletar',
          handler: () => {
            this.deleteNotification(notification);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteNotification(notification){
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
      this.server.protocol+this.server.host+this.server.port+"/notifications/delete", 
      notification, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      if(response['success'] == true){
        this.getNotificationsData();
      }
      const toast = await this.toastCtrl.create({
        message: response['msg'],
        duration:2000, 
        position:'top'
      });
      await loading.dismiss();
      toast.present();
    });
  }

  async send(){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    var data:any = {
      author:{
        _id: this.userData['_id'],
        name: this.userData['name']
      },
      title: this.notificationForm.get('title').value,
      msg: this.notificationForm.get('msg').value,
      date: this.notificationForm.get('date').value,
      api_key: this.notificationForm.get('api_key').value
    }

    if(this.notificationForm.get('recurrent').value == 'true'){
      const date = new Date(this.notificationForm.get('date').value);
      const time = new Date(this.notificationForm.get('time').value);
      var trigger = {
        count: parseInt(this.recurrent['count'])
      };
      if(this.recurrent['type'] == '1'){
        trigger['at'] = {
          month: date.getMonth()+1,
          day: date.getDate(),
          hour: time.getHours(),
          minute: time.getMinutes()
        }
      }
      if(this.recurrent['type'] == '2'){
        trigger['every'] = this.recurrent['every']
      }
      data.trigger = trigger;
    }

    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/notifications/new", 
      data, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      if(response['success'] == true){
        this.getNotificationsData();
        this.emitGlobalNotification(data);
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
