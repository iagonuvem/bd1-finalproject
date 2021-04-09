import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { SetTutoringPage } from '../modals/set-tutoring/set-tutoring.page'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from './../../services/server.service';
import { Storage } from '@ionic/storage';
import { CoreService } from 'src/app/services/core.service';

declare var gapi:any;

@Component({
  selector: 'app-tutoring',
  templateUrl: './tutoring.page.html',
  styleUrls: ['./tutoring.page.scss'],
})


export class TutoringPage implements OnInit {
  @ViewChild(CalendarComponent , {static: false}) myCal: CalendarComponent;
  currentTab = "todo";
  toggle = false;
  collapseCard = true;
  eventSource = [];
  viewTitle = new Date().toISOString();
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  start = 0;
  userData:any;
  googleCalendarId:any;
  googleCredentials:any;
  credits:any = 0;
  gCalSchedule:any = [];
  activeTutoringType:any = 'new';

  constructor(private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private server: ServerService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private coreService: CoreService
    ) { 
      // https://seedidiomas.com/privacy-and-cookie-policy/
      gapi.client.init({
        'apiKey': this.coreService.getGApiKey(),
        // clientId and scope are optional if auth is not required.
        'clientId': this.coreService.getGClientId(),
        'scope': 'https://www.googleapis.com/auth/calendar',
      });
    }

  async initEvents(){
    try {
      gapi.client.init({
        'apiKey': this.coreService.getGApiKey(),
        // clientId and scope are optional if auth is not required.
        'clientId': this.coreService.getGClientId(),
        'scope': 'https://www.googleapis.com/auth/calendar',
      });

      await this.getEventsDetails(this.userData['tutoring'].schedule);

      let gcal = await this.getGCalendarEvents();
      if (gcal.result) {
        this.changeMode('month');
        this.start = 0;
        await this.fillEvents(gcal.result.items);
      }
    } catch (error) {
      // console.log(error);
      const toast = await this.toastCtrl.create({
        message: 'Ops... parece que algo deu errado, alguns recursos podem não estar funcionando corretamente.',
        duration: 2000
      });
      toast.present();
    }
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      // duration: 2000
    });
    await loading.present();

    this.userData = await this.coreService.refreshUserData();
    this.credits = this.userData['tutoring'].credits;
    this.googleCalendarId = await this.coreService.getCalendarByAPIKey(this.userData['api_key']);

    await this.initEvents();
    loading.dismiss();
  }

  tutoringTypeChanged(event){
    // console.log(event);
    this.activeTutoringType = event.detail.value;
  }

  async tutoringDetail(data){
    // console.log(data);
    const modal = await this.modalCtrl.create({
      component: SetTutoringPage,
      componentProps: {
        'date': { 'selectedTime': data.start.dateTime },
        'googleDescription': data.description,
        'calendarId': data.organizer.email,
        'eventId': data.id,
        'tutor': data.tutor,
        'credentials': this.userData['googleApiCredentials'],
        'edit': true
      }
    });
    await modal.present();

    modal.onDidDismiss().then(async () => {
      this.userData = this.coreService.getUserData();
      this.credits = this.userData['tutoring']['credits'];
      await this.initEvents();
    })
  }
  
  async getEventsDetails(events){
    this.gCalSchedule = [];
    for(let event of events){
      // console.log(event);
      try {
        let gcal = await gapi.client.request({
          'path': 'calendar/v3/calendars/'+this.coreService.getCalendarByAPIKey(this.userData['api_key'])+'/events/'+event.eventId
        });
        // console.log(gcal);
        let now = new Date();
        let eventStart = new Date(gcal.result.start.dateTime);
        if(eventStart.getTime() > now.getTime()){
          gcal.result['tutor'] = event.tutor;
          this.gCalSchedule.push(gcal.result);
        }
      } catch (error) {
        // console.log(error);
      }
    }
    // console.log(this.gCalSchedule);
  }

  async getGCalendarEvents(){
    let gcal = await gapi.client.request({
      'path': 'calendar/v3/calendars/'+this.coreService.getCalendarByAPIKey(this.userData['api_key'])+'/events',
      'params': {
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false
      }
    });
    
    return gcal;
  }

  authorizeOAuth(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };
    this.http.post(this.server.protocol+this.server.host+this.server.port+"/tutoring/getOAuthUrl", 
    {
      "_id": this.userData['_id']
    }, 
    httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      this.loadingCtrl.dismiss();
      if(response['success']){
        window.location.href=response['url'];
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Falha ao buscar dados da agenda.',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  getEvents(){
    // GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'key': this.coreService.getGApiKey()
      })
    };
    this.http.get("https://www.googleapis.com/calendar/v3/calendars/"+this.coreService.getCalendarByAPIKey(this.userData['api_key'])+"/events?key="+this.coreService.getGApiKey(), 
    httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      console.log(response);
    })
  }

  fillEvents(events){
    for(let event of events){
      const e = {
        title: 'Indisponível',
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
        allDay: false
      }
      this.eventSource.push(e);
    }
    this.myCal.loadEvents();
  }

  markDisabled = (date: Date) => {
      var current = new Date();
      return date < current;
  };

  onChange($event){
    // console.log($event);
    this.changeMode('day');
  }

  async onEventSelected(ev){
    // console.log(ev);    
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  async onTimeSelected(ev) {
    // console.log(ev);
    const available = await this.checkAvailability(ev.selectedTime);
    if(!available){
      ev.disabled = true;
    }
    if (this.start > 0) {
      if(this.calendar.mode == 'month'){
        this.changeMode('day');
      }else{
        this.schedule(ev);
      }
    }
    this.start++;
  }

  onCurrentDateChanged(ev){
    // console.log(ev);
  }

  changeMode(mode){
    this.calendar.mode = mode;
  }
  
  async checkAvailability(date:Date){
    for(let event of this.eventSource){
      let sourceTime = new Date(event.startTime);
      if(sourceTime.getTime() == date.getTime()){
        return false;
      }
    }
    return true;
  }

  async schedule(ev){
    if (!ev.disabled) {
      const modal = await this.modalCtrl.create({
        component: SetTutoringPage,
        componentProps: {
          'date': ev,
          'calendarId': this.googleCalendarId,
          'credentials': this.userData['googleApiCredentials']
        }
      });
      await modal.present();

      modal.onDidDismiss().then(async () => {
        this.userData = this.coreService.getUserData();
        this.credits = this.userData['tutoring']['credits'];
        await this.initEvents();
      })

      this.changeMode('month');
      this.start = 0;
      return;
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Data e Hora Indisponível.',
        duration: 2000
      });
      toast.present();
    }
  }
}
