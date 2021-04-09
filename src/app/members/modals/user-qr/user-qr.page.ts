import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-qr',
  templateUrl: './user-qr.page.html',
  styleUrls: ['./user-qr.page.scss'],
})
export class UserQrPage implements OnInit {
  userData:any = null;
  qrCode:any = null;
  age:any = 0;
  constructor(private modalCtrl: ModalController,
    private storage: Storage) { 
    this.storage.get('userData').then((userData) => {
      this.userData = userData;
      this.qrCode = userData['student_id'].toString();
      this.age = this._calculateAge(new Date(this.userData['birthdate']));
    });
  }

  ngOnInit() {
  }
  
  dismissModal(){
    this.modalCtrl.dismiss();
  }
  _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
