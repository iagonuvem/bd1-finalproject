import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  exercises:any = [];
  exercisesForm:FormGroup;
  options: any = [];
  editingId: any = null;
  loading:any = true;
  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private server: ServerService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController) { 
      this.exercisesForm = this.formBuilder.group({
        level: new FormControl('', Validators.required),
        statement: new FormControl('', Validators.required),
        correct_option: new FormControl('', Validators.required),
        clarification: new FormControl(''),
        other_option: new FormControl('')     
      })
    }

  ngOnInit() {
    this.getByLevel(1);
  }

  filter($event){
    this.getByLevel(parseInt($event.detail.value));
  }

  addOption(){
    this.options.push({
      'desc': this.exercisesForm.get('other_option').value,
      'correct': false
    });
    this.exercisesForm.get('other_option').setValue('');
  }

  removeOption(index){
    this.options.splice(index,1);
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

  edit(exercise){
    // console.log(exercise);
    this.editingId = exercise['_id'];
    for(var i in exercise['options']){
      if(exercise['options'][i].correct == false){
        this.options.push(exercise['options'][i]);
      }else{
        this.exercisesForm.get('correct_option').setValue(exercise['options'][i].desc);
      }
    }
    this.exercisesForm.get('statement').setValue(exercise['statement']);
    this.exercisesForm.get('clarification').setValue(exercise['clarification']);
    this.exercisesForm.get('level').setValue(exercise['level']);
  }

  async confirmDelete(exercise){
    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente excluir?!',
      message: 'Essa ação não poderá ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Deletar',
          handler: () => {
            this.deleteExercise(exercise);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteExercise(exercise){
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
      this.server.protocol+this.server.host+this.server.port+"/exercises/delete", 
      {'_id': exercise._id}, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async response => {
      const toast = await this.toastCtrl.create({
        message: response['msg'],
        duration:2000,
        position: 'top'
      });
      await loading.dismiss();
      toast.present();
    });
  }

  async save(){
    var options = [];
    for(var i in this.options){
      options.push(this.options[i]);
    }
    options.push({
      'desc': this.exercisesForm.get('correct_option').value,
      'correct': true
    })

    var endPoint = '/exercises/insert';
    var data = {
      statement : this.exercisesForm.get('statement').value,
      level: parseInt(this.exercisesForm.get('level').value),
      options: options,
      clarification: this.exercisesForm.get('clarification').value
    }

    const loading = await this.loadingCtrl.create({
      message: 'Aguarde enquanto salvamos os dados'
    });
    await loading.present();

    if(this.editingId != null){
      endPoint = '/exercises/update';
      data['_id'] = this.editingId;
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
    .pipe(map(res => res))
    .subscribe(async response => {
      if(response['success'] == true){
        this.editingId = null;
        this.exercisesForm.reset();
        this.options = [];
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

  getByLevel(level){
    this.exercises = [];
    this.loading = true;
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
        // console.log(response);
        this.loading = false;
        this.exercises = response
        // console.log(this.exercises);
      });
  }
}
