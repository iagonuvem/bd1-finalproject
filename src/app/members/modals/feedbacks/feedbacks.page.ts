import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from 'src/app/services/server.service';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.page.html',
  styleUrls: ['./feedbacks.page.scss'],
})
export class FeedbacksPage implements OnInit {
  msg:any;
  userData:any;
  constructor(
    private http: HttpClient,
    private server: ServerService,
    private storage: Storage,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
    ) { 
      this.storage.get('userData').then((userData) => {
        this.userData = userData;
      });
    }

  ngOnInit() {
  }
  send(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/users/feedback", 
      {
        msg: this.msg,
        student_id: this.userData["student_id"],
        api_key: this.userData["api_key"]
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      this.msg = '';
      const toast = await this.toastCtrl.create({
        message: 'Obrigado pela sua ajuda!',
        duration: 2000
      });
      toast.present();
      // console.log(response);
    });
  }
  dismissModal(){
    this.modalCtrl.dismiss();
  }
}
