import { AuthenticationService } from './../../../services/authentication.service';
import { ServerService } from './../../../services/server.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
  loaderHide = true;
  btnBlock = false;
  user = {
    login: null,
    password: null
  };
  data = {
    api_key: null,
    userType: null
  };
  loginForm: FormGroup;
  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private nativeHttp: HTTP,
    private server: ServerService,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private localNotifications: LocalNotifications,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      student_id: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        //console.log(getNav.extras.state);
        this.data.api_key = getNav.extras.state.api_key;
        this.data.userType = parseInt(getNav.extras.state.userType);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  async presentAlert(options) {
    const alert = await this.alertCtrl.create(options);
    await alert.present();
  }

  isStudent(){
    return (this.data.userType == 4);
  }
  
  ngOnInit() {
  }

  async resetPassword(){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Recuperação de Senha',
        message: 'Digite o seu email que lhe enviaremos seus dados de acesso.',
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: 'Email'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // console.log('Confirm Cancel');
            }
          }, {
            text: 'Recuperar Senha',
            handler: async (data) => {
              const loading = await this.loadingCtrl.create({
                message: 'Aguarde enquanto lhe enviamos os dados...'
              });
              await loading.present();

              try {
                const httpOptions = {
                  headers: new HttpHeaders({
                    'Content-type': this.server.headers["Content-type"],
                    'Access-Control-Allow-Origin' : '*',
                    'Accept': this.server.headers["Content-type"]
                  })
                };

                this.http.post(
                  this.server.protocol + this.server.host + this.server.port + "/users/resetPassword",
                  data,
                  httpOptions)
                  .pipe(map(res => res)
                  ).subscribe(async response => {
                    loading.dismiss();
                    let alertOptions = {
                      message: response['msg'],
                      buttons: ['OK']
                    }
                    await this.presentAlert(alertOptions);
                  });
              } catch (error) {
                let alertOptions = {
                  header: 'Falha ao Recuperar senha',
                  message: 'Parece que estamos com problemas nos nossos servidores, tente novamente mais tarde.',
                  buttons: ['OK']
                }
                this.presentAlert(alertOptions);
              }
            }
          }
        ]
      });
  
      await alert.present();
  }

  /**
   * Função que tenta realizar o Login
   * @author Iago Nuvem
   * @since 10/2019 
   */
  attemptLogin() {
    this.loaderHide = false;
    this.btnBlock = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': this.server.headers["Content-type"],
        'Access-Control-Allow-Origin' : '*',
        'Accept': this.server.headers["Content-type"]
      })
    };
    var params = {
      password: this.loginForm.get('password').value,
      access_type: this.data.userType,
      api_key: this.data.api_key
    };

    if(this.data.userType == 4){
      params['spontenet_username'] = this.loginForm.get('student_id').value;
    }else{
      params['cpf'] = this.loginForm.get('student_id').value;
    }

    try {
      this.http.post(
        this.server.protocol + this.server.host + this.server.port + "/users/login",
        params,
        httpOptions)
        .pipe(map(res => res)
        ).subscribe(response => {
          this.loaderHide = true;
          this.btnBlock = false;
          if (response["ok"] != 1) { // ERRO
            let alertOptions = {
              header: 'Falha no Login',
              message: response["msg"],
              buttons: ['OK']
            }
            this.presentAlert(alertOptions);
          }
          else {
            //console.log(response["data"]);
            // set a key/value
            response["data"]["api_key"] = this.data.api_key;
            // Mensagem de parabéns
            this.localNotifications.schedule({
              title: 'Happy Birthday!',
              text: 'Que sua vida seja repleta de momentos bons e felizes ;)',
              trigger: {at: new Date(response["data"]["birthdate"])},
              led: '00ff00',
              sound: null
            });
            this.storage.set("firstLogin", true);
            this.authService.login(response["data"]);
            this.router.navigate(['members']);
          }
        }, (err) => {
          this.loaderHide = false;
          let alertOptions = {
            header: 'Falha no Login',
            message: 'Parece que estamos com problemas nos nossos servidores, tente novamente mais tarde',
            buttons: ['OK']
          }
          this.presentAlert(alertOptions);
        });
    } catch (error) {
      this.loaderHide = false;
      let alertOptions = {
        header: 'Falha no Login',
        message: 'Parece que estamos com problemas nos nossos servidores, tente novamente mais tarde',
        buttons: ['OK']
      }
      this.presentAlert(alertOptions);
    }
  }

}
