import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  userData = {};
  progress = 0;
  presence = 0;
  currentAvg = 0;
  currentSituation = "";
  classes = [];
  currentClass:any = {};
  currentClassMembers = [];
  httpOptions: any = {};

  //Views Variables
  noCurrentClass = true;
  noConcludedClass = true;
  showCurrentSchedule = false;
  activeClassType = 'progress';
  
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private server: ServerService,
    private router: Router,
    private navCtrl: NavController
    ) {
      this.storage.get('userData').then((userData) => {
        this.userData = userData;
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-type':  this.server.headers["Content-type"],
            'api_key': this.userData["api_key"]
          })
        };
        var currentMonth = new Date().getMonth()+1;
        var currentYear = new Date().getFullYear();

        var currentSemester;
        if(currentMonth < 6){
          currentSemester = '1/'+currentYear.toString();
        }
        else{
          currentSemester = '2/'+currentYear.toString();
        }
        for(var i in userData["registrations"]){
          if(userData["registrations"][i].class_id != 0){
            this.noConcludedClass = false;
            this.http.post(
              this.server.sponteURL+'classes', 
              {
                class_id: this.userData["registrations"][i].class_id
              }, 
              this.httpOptions)
            .pipe(map(res => res)
            ).subscribe(response => {
              let currentLoop:any = response;
              this.http.post(
                this.server.sponteURL + 'lessons',
                {
                  class_id: response["class_id"],
                  student_id: this.userData["student_id"],
                  situation: 1
                },
                this.httpOptions)
                .pipe(map(res => res)
                ).subscribe(response => {
                  currentLoop["lessons"] = response;
                  if(currentLoop["semester"] == currentSemester){
                    this.calcProgress();
                    this.calcPresence();
                    this.getStudentClassDetails();
                  }
                })  
  
              if(response["semester"] == currentSemester){
                this.currentClass = response;
                this.noCurrentClass = false;
              }
              else{
                this.classes.push(currentLoop);
              }
            });
          } 
        }
      });
    }

  ngOnInit() {
    
  }

  navigateClass(c){
    let navigationExtras: NavigationExtras = c;
    this.router.navigate(['members/menu/master/class'], navigationExtras);
  }
  
  classTypeChanged(event){
    this.activeClassType = event.detail.value;
  }

  isTeacher(){
    return (this.userData['access_type'] == 3);
  }
  /**
   * Retorna média de notas do aluno e situação
   */
  getStudentClassDetails(){
    const currentClass = this.userData["registrations"][this.userData["registrations"].length - 1];
    this.http.post(
      this.server.sponteURL + 'scores',
      {
        student_id: this.userData["student_id"],
        class_id: this.currentClass["class_id"],
        phase_id: currentClass["phase_id"]
      },
      this.httpOptions)
      .pipe(map(res => res)
      ).subscribe(response => {
        this.currentSituation = response["situation"];
        var sum = 0;
        for (var i in response["grades"]) {
          sum += (response["grades"][i].score) / (response["grades"][i].maximum_value);
        }
        this.currentAvg = sum / response["grades"].length;
      }) 
  }

  /**
   * Calcula a porcentagem de presença do aluno
   * @returns void
   */
  calcPresence(){
    var sum = 0;
    for(var i in this.currentClass["lessons"]){
      if(this.currentClass["lessons"][i].presence == 1){
        sum++;
      }
    }
    var avg = sum/this.currentClass["lessons"].length;
    this.presence = avg;
  }
  /**
   * Calcula o progresso da turma atual
   * @returns void
   */
  calcProgress(){
    var schedule_max = parseInt(this.currentClass["schedule"].length) - 1;
    var start = new Date(this.currentClass["schedule"][0].schedule_date).getTime();
    var end = new Date(this.currentClass["schedule"][schedule_max].schedule_date).getTime();
    
    // start = (start / 100000000000) - Math.floor(start / 100000000000);
    // end = (end / 100000000000) - Math.floor(end / 100000000000);

    this.progress = (start/end);
  }
}
