import { Component, OnInit } from '@angular/core';
import { UserQrPage } from '../modals/user-qr/user-qr.page';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {
  partners:any;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private server: ServerService,
    private http: HttpClient) { 
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-type': this.server.headers["Content-type"],
          // 'Access-Control-Allow-Origin' : '*',
          // 'Accept': this.server.headers["Content-type"]
        })
      };
  
      this.http.get(
        this.server.protocol + this.server.host + this.server.port + "/partners/getAll",
        httpOptions)
        .pipe(map(res => res)
        ).subscribe(response => {
          this.partners = response;
        });
    }

  ngOnInit() {  
    
  }

  partner(partner){
    let navigationExtras: NavigationExtras = partner;
    this.router.navigate(['members/menu/master/premium/partner'], navigationExtras);
  }
  async UserQr(){
    const modal = await this.modalCtrl.create({
      component: UserQrPage,
      componentProps: {}
    });
    return await modal.present();
  }

}
