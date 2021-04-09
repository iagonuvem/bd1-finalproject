import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  showExercise = false;
  loading = true;
  noExercises = false;
  exercises:any;
  exercisesInitLength:any;
  currentExercise = {}
  score = 0;
  exercisesMade = 0;
  progress = 0;
  wins = 0;
  loses = 0;
  constructor(
    private http: HttpClient,
    private server: ServerService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }
  init(){
    this.score = 0;
    this.progress = 0;
    this.wins = 0;
    this.loses = 0;
    this.exercisesMade = 0;
    this.loading = false;
    this.noExercises = true;
    this.showExercise = false;
    this.currentExercise = {};
  }
  async checkOption(desc,bool){
    const alert = await this.alertCtrl.create({
      header: 'Confirma sua escolha para a opção:',
      message: desc,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: async () => {
            this.exercisesMade++;
            this.progress = this.exercisesMade / this.exercisesInitLength;
            if(bool){ // ACERTO
              this.wins++;
              this.score = this.wins / this.exercisesInitLength;
              if(this.exercises.length == 0){
                this.noExercises = true;
                this.currentExercise = {};
              }
              var pop = this.exercises.pop();
              if(pop){
                if(pop["_id"] === this.currentExercise["_id"]){
                  this.currentExercise = this.exercises.pop();
                }
                else{
                  this.currentExercise = pop
                }
              }
            }
            else{ // ERRO
              this.loses++;
              const alertC = await this.alertCtrl.create({
                header: 'Ops.. You miss that one!',
                message: this.currentExercise["clarification"],
              })
              await alertC.present(); 
              if(this.exercises.length == 0){
                this.noExercises = true;
                this.currentExercise = {};
              }
              var pop = this.exercises.pop();
              if(pop){
                if(pop["_id"] === this.currentExercise["_id"]){
                  this.currentExercise = this.exercises.pop();
                }
                else{
                  this.currentExercise = pop
                }
              }
            }            
          }
        }
      ]
    });

    await alert.present();
    
  }
  getByLevel(level){
    this.showExercise=true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    this.http.post(
      this.server.protocol + this.server.host + this.server.port + "/exercises/getByLevel",
      {
        level: level
      },
      httpOptions)
      .pipe(map(res => res)
      ).subscribe(response => {
        this.loading = false;
        this.exercises = response
        // console.log(this.exercises);
        this.exercisesInitLength = this.exercises.length;
        if(this.exercises.length == 0){
          this.noExercises = true;
        }else{
          this.currentExercise = this.exercises[this.exercises.length-1];
        }
      });
  }
}
