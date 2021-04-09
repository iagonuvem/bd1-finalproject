import { Component, OnInit, Input} from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from '../../../services/server.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-set-tutoring',
  templateUrl: './set-tutoring.page.html',
  styleUrls: ['./set-tutoring.page.scss'],
})
export class SetTutoringPage implements OnInit {
  @Input() name: string;
  @Input() calendarId: string;
  @Input() eventId: string;
  @Input() tutor: Object;
  @Input() date: string;
  @Input() googleDescription: string;
  @Input() edit: Boolean;

  selectedTutor:any = null;
  userData:any;
  tutors: any;
  description:any = '';
  googleCredentials:any = null;

  constructor(
    private modalCtrl: ModalController,
    private googlePlus: GooglePlus,
    private http: HttpClient,
    private server: ServerService,
    private coreService: CoreService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { 
      this.userData = this.coreService.getUserData();
      if(this.userData['googleApiCredentials']){
        this.googleCredentials = this.userData['googleApiCredentials'];
      }
  }

  async ngOnInit() {
    if(this.googleDescription){
      this.description = this.googleDescription;
    }
    if(this.tutor){
      this.selectedTutor = this.tutor;
    }
    if(!this.edit){
      this.getTutors();
    }
    this.googlePlus.login({
      'scopes' : 'https://www.googleapis.com/auth/calendar'
    })
      .then((res) => {
        this.googleCredentials = res;
      })
      .catch(async err => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Houve uma falha ao comunicar com a agenda! Tente novamente mais tarde!',
          duration: 2000
        });
        toast.present();
      }); 
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  async confirmCancel(){
    if(this.googleCredentials != null){
      let start = new Date(this.date['selectedTime']);
      let now = new Date();

      var msg = '';
      if((start.getTime() - now.getTime()) < 3600000){
        msg = 'Você está cancelando a tutoria com menos de uma hora de antecedência e portanto seu crédito não será reembolsado.'
      }

      const alert = await this.alertCtrl.create({
        header: 'Deseja Realmente Cancelar a tutoria?!',
        message: msg,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Sim, cancelar!',
            handler: async () => {
              this.cancelSchedule();
            }
          }
        ]
      });
  
      await alert.present();
    } else{
      const toast = await this.toastCtrl.create({
        message: 'Usuário google não autenticado!',
        duration: 2000
      });
      toast.present();
    }
   
  }

  async cancelSchedule(){
    const loading = await this.loadingCtrl.create({
      'message': 'Aguarde enquanto cancelamos sua tutoria!'
    });
    await loading.present();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };

    try {
      var expiry_split = this.googleCredentials.expires_in.toString().split('');
      var expiry_in = expiry_split[0]+expiry_split[1]+expiry_split[2];
      let expiry = parseInt(this.googleCredentials.expires.toString()+expiry_in);
      this.http.post(this.server.protocol+this.server.host+this.server.port+"/tutoring/removeEvent", 
      {
        "_id": this.userData['_id'],
        "eventId": this.eventId,
        "calendarId": this.calendarId,
        "credentials": {
          "access_token" : this.googleCredentials.accessToken,
          "scope" : "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
          "token_type" : "Bearer",
          "expiry_date" : expiry
        }
      }, 
      httpOptions)
      .pipe(map(res => res)
      ).subscribe(async response => {
        await this.coreService.refreshUserData();
        this.loadingCtrl.dismiss();
        const toast = await this.toastCtrl.create({
          message: response['msg'],
          duration: 2000
        });
        await toast.present();
        this.modalCtrl.dismiss();
      })
    } catch (error) {
      // console.log(error);
      const toast = await this.toastCtrl.create({
        message: 'Algo deu errado! Tente novamente mais tarde!',
        duration: 2000
      });
      toast.present();
      this.loadingCtrl.dismiss();
    }
  }

  async schedule(){
    if(this.googleCredentials != null){
      const loading = await this.loadingCtrl.create({
        'message': 'Aguarde enquanto agendamos sua tutoria!'
      });
      await loading.present();
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-type':  this.server.headers["Content-type"]
        })
      };
      
      let endTime = new Date(this.date['selectedTime']);
      if(endTime.getMinutes() == 0){
        endTime.setMinutes(30);
      }else if(endTime.getMinutes() == 30){
        endTime.setHours(endTime.getHours()+1);
        endTime.setMinutes(0);
      }
      
      try {
        var expiry_split = this.googleCredentials.expires_in.toString().split('');
        var expiry_in = expiry_split[0]+expiry_split[1]+expiry_split[2];
        let expiry = parseInt(this.googleCredentials.expires.toString()+expiry_in);
        let credits = parseInt(this.userData['tutoring'].credits)
        this.http.post(this.server.protocol+this.server.host+this.server.port+"/tutoring/setEvent", 
        {
          "_id": this.userData['_id'],
          "tutoring": {
            'credits': credits,
            'schedule': this.userData['tutoring'].schedule
          },
          "event": {
            "summary": this.userData['name'],
            "description": this.description,
            "startTime": this.date['selectedTime'],
            "endTime": endTime
          },
          "attendee": this.selectedTutor,
          "calendarId": this.calendarId,
          "credentials": {
            "access_token" : this.googleCredentials.accessToken,
            "scope" : "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
            "token_type" : "Bearer",
            "expiry_date" : expiry
          }
        }, 
        httpOptions)
        .pipe(map(res => res)
        ).subscribe(async response => {
          await this.coreService.refreshUserData();
          this.loadingCtrl.dismiss();
          const toast = await this.toastCtrl.create({
            message: response['msg'],
            duration: 2000
          });
          await toast.present();
          this.modalCtrl.dismiss();
        })
      } catch (error) {
        // console.log(error);
        const toast = await this.toastCtrl.create({
          message: 'Algo deu errado! Tente novamente mais tarde!',
          duration: 2000
        });
        toast.present();
        this.loadingCtrl.dismiss();
      }
    } else{
      const toast = await this.toastCtrl.create({
        message: 'Usuário google não autenticado!',
        duration: 2000
      });
      toast.present();
    }
  }

  async getTutors(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };

    try {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.http.post(this.server.protocol+this.server.host+this.server.port+"/tutoring/getTutorsByUnit", 
      {
        "api_key": this.userData['api_key']
      }, 
      httpOptions)
      .pipe(map(res => res)
      ).subscribe(async response => {
        this.loadingCtrl.dismiss();
        if(response['success']){
          this.tutors = response['data'];
        }else{
          const toast = await this.toastCtrl.create({
            message: response['msg'],
            duration: 2000
          });
          toast.present();
        }
      })
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Algo deu errado! Tente novamente mais tarde!',
        duration: 2000
      });
      toast.present();
      this.loadingCtrl.dismiss();
    }
    
  }
}
