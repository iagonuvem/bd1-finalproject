import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Storage } from '@ionic/storage';
import { NavParams, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-class-chat',
  templateUrl: './class-chat.page.html',
  styleUrls: ['./class-chat.page.scss'],
})
export class ClassChatPage implements OnInit {
  userData = {};
  currentUser = '';
  classData = {
    "_id" : "",
    "class_id": "",
    "class_name": ""
  };
  messages = [];
  msg = '';
  constructor(
    private socket: Socket,
    private storage: Storage,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private server: ServerService,
    ) { 
    this.classData._id = navParams.get('_id');
    this.classData.class_id = navParams.get('class_id');
    this.classData.class_name = navParams.get('class_name');
    this.messages = navParams.get('chat');

    this.storage.get('userData').then((userData) => {
      this.userData = userData;
      this.currentUser = userData['name'];
    })
    this.socket.connect();
    this.socket.fromEvent('msgUserIn').subscribe((data) => {
      if(data["class_id"] == this.classData.class_id){
        this.messages.push(data);
      }
    });
  }

  ngOnInit() {
    
  }

  ionViewWillLeave() {
    // SALVAR A MSG NO BD AQUI.
    this.socket.disconnect();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/classes/update", 
      {
        _id: this.classData._id,
        chat: this.messages
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(response => {
      // console.log(response);
    });
    
  }

  sendMessage(){
    this.socket.emit('sendMsg', {
      name: this.userData['name'],
      msg: this.msg,
      class_id: this.classData.class_id,
      class_name: this.classData.class_name,
      _id: this.classData._id
    });
    this.msg = '';
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }
}
