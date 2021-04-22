import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassChatPage } from '../modals/class-chat/class-chat.page'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type':  this.server.headers["Content-type"]
    })
  };
  chatDisabled = true;
  classData = {};
  members = [];
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private server: ServerService,

  ) { 
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras) {
        this.classData = getNav.extras;
        // console.log(this.classData);
        this.getClassChat(this.classData["class_id"]);
      } 
      else{
        this.router.navigate(['members/menu/master/classes']);
      }
    });
  }

  ngOnInit() {
  }

  getClassChat(class_id){
    this.http.post(
      this.server.protocol+this.server.host+this.server.port+"/classes/getById", 
      {
        class_id: class_id
      }, 
      this.httpOptions)
    .pipe(map(res => res)
    ).subscribe(response => {
      if(response["members"]){
        this.classData["members"] = response["members"];
      }
      if(response["professor_name"]){
        this.classData["professor_name"] = response["professor_name"];
      }
      this.classData["chat"] = response["chat"];
      this.classData["_id"] = response["_id"];
      this.chatDisabled = false;
      this.getMembers(this.classData["members"]);
    });
  }
  
  /**
   * Preenche dados dos estudantes
   * @param members array com id dos estudantes
   * @returns void
   */
  getMembers(members){
    if(members.length > 0){
      this.members = members;
    }
  }

  async modalChat() {
    const modal = await this.modalCtrl.create({
      component: ClassChatPage,
      componentProps: {
        '_id': this.classData["_id"],
        'class_id': this.classData["class_id"],
        'class_name': this.classData["name"],
        'chat': this.classData["chat"]
      }
    });
    return await modal.present();
  }
}
