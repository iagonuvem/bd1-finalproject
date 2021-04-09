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
        name: new FormControl(this.userData["name"], Validators.required),
        job: new FormControl(this.userData["job"]),
        email: new FormControl(this.userData["email"], Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        cell_phone: new FormControl(this.userData["cell_phone"], Validators.required),
        home_phone: new FormControl(this.userData["home_phone"]),
        zip_code: new FormControl(this.userData["zip_code"]),
        address: new FormControl(this.userData["address"]),
        number: new FormControl(this.userData["number"]),
        district: new FormControl(this.userData["district"]),
        city: new FormControl(this.userData["city"]),
        cpf: new FormControl(this.userData["cpf"],Validators.required),
        rg: new FormControl(this.userData["rg"])
      });
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: new FormControl(this.userData["name"], Validators.required),
      job: new FormControl(this.userData["job"]),
      email: new FormControl(this.userData["email"], Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      cell_phone: new FormControl(this.userData["cell_phone"], Validators.required),
      home_phone: new FormControl(this.userData["home_phone"]),
      zip_code: new FormControl(this.userData["zip_code"]),
      address: new FormControl(this.userData["address"]),
      number: new FormControl(this.userData["number"]),
      district: new FormControl(this.userData["district"]),
      city: new FormControl(this.userData["city"]),
      cpf: new FormControl(this.userData["cpf"],Validators.required),
      rg: new FormControl(this.userData["rg"])
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
    this.userData["cpf"] = this.userForm.get("cpf").value;
    this.userData["rg"] = this.userForm.get("rg").value;
    this.userData["address"] = this.userForm.get("address").value;
    this.userData["number"] = this.userForm.get("number").value;
    this.userData["city"] = this.userForm.get("city").value;
    this.userData["district"] = this.userForm.get("district").value;
    this.userData["zip_code"] = this.userForm.get("zip_code").value;
    this.userData["home_phone"] = this.userForm.get("home_phone").value;
    this.userData["cell_phone"] = this.userForm.get("cell_phone").value;
    this.userData["job"] = this.userForm.get("job").value;

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
        "birthdate": this.userData["birthdate"],
        "cpf": this.userForm.get("cpf").value,
        "rg": this.userForm.get("rg").value,
        "address": this.userForm.get("address").value,
        "number": this.userForm.get("number").value,
        "city": this.userForm.get("city").value,
        "district": this.userForm.get("district").value,
        "zip_code": this.userForm.get("zip_code").value,
        "home_phone": this.userForm.get("home_phone").value,
        "cell_phone": this.userForm.get("cell_phone").value,
        "job": this.userForm.get("job").value,
        "photo": this.userData["photo"],
        "spontenet_password": this.userData["spontenet_password"]
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
