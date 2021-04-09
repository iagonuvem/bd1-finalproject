import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController, NavParams } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-popover-financial',
  templateUrl: './popover-financial.component.html',
  styleUrls: ['./popover-financial.component.scss'],
})
export class PopoverFinancialComponent implements OnInit {
  field:any;
  constructor(
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private clipboard: Clipboard,
    private navParams: NavParams
  ) {
    this.field = this.navParams.get('field');
  }

  ngOnInit() {}

  async copy(field){
    this.clipboard.copy(field)
    .then(async ()=>{
      this.popoverCtrl.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Código do boleto copiado!',
        duration: 2000
      });
      toast.present();
      
    });
  }
}
