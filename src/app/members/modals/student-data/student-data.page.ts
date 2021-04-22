import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.page.html',
  styleUrls: ['./student-data.page.scss'],
})
export class StudentDataPage implements OnInit {
  userData = {}
  cpf_cnpj = '';
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;
  userForm: FormGroup;
  constructor(
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private server: ServerService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.storage.get('userData').then((userData) => {
      this.userData = userData;

      this.userForm = this.formBuilder.group({
        name: new FormControl(this.userData["name"], Validators.required)
      });
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: new FormControl(this.userData["name"], Validators.required)
    });
  }

  buscaCEP(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };
    this.http.get(
    'https://viacep.com.br/ws/'+this.userForm.get("zip_code").value+'/json',
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async(response) => {
      this.userForm.get("address").setValue(response['logradouro']);
      this.userForm.get("city").setValue(response['localidade']);
      this.userForm.get("district").setValue(response['bairro']);
      // console.log(response);
    });
  }

  async save(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.userData["name"] = this.userForm.get("name").value;


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };
    this.http.post(
      this.server.protocol+this.server.host+this.server.port+'/users/update', 
      {
        "_id": this.userData["_id"],
        "api_key": this.userData["api_key"],
        "student_id": this.userData["student_id"],
        "name": this.userForm.get("name").value,
      }, 
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(async(response) => {
      console.log(response);
      if(response['success'] != false){
        this.storage.set("userData", this.userData); //atualiza dados da sessão
      }
      const toast = await this.toastCtrl.create({
        message: response["msg"],
        duration: 2000
      });
      toast.present();
      loading.dismiss();
    });
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }
}
