import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';


@Component({
  selector: 'app-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
})
export class DiscountPage implements OnInit {
  discountCode: any;
  userData = {};
  firstName = "";
  constructor(
    private socialSharing: SocialSharing,
    private storage: Storage,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public clipboard: Clipboard,
    public toastCtrl: ToastController
  ) {
    this.storage.get('userData').then((userData) => {
      this.discountCode = userData["spontenet_username"];
      this.userData = userData;
      this.firstName = userData["name"].split(" ")[0];
    });
  }

  ngOnInit() {
  }

  async shareActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Compartilhar por:",
      buttons: [
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.shareWPP();
          }
        },
        {
          text: 'SMS',
          icon: 'chatbubbles',
          handler: () => {
            this.shareSMS();
          }
        },
        // {
        //   text: 'Email',
        //   icon: 'mail',
        //   handler: () => {
        //     this.shareEmail();
        //   }
        // }, 
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  shareWPP() {
    this.socialSharing.shareViaWhatsApp('Olá eu sou aluno Seed e gostaria de compartilhar uma oportunidade com você! Utilize o meu cupom e ganhe 15% de desconto na matrícula. Meu código é: ' + this.discountCode + ', apresente na secretaria ou acesse o link', '', 'https://seedidiomas.com/aula-experimental/').then(() => {
    })
      .catch((error) => {
        console.log(error);
      })
  }
  shareSMS() {
    this.socialSharing.shareViaSMS('Olá eu sou aluno Seed e gostaria de compartilhar uma oportunidade com você! Utilize o meu cupom e ganhe 15% de desconto na matrícula. Meu código é: ' + this.discountCode + ', apresente na secretaria ou acesse o link https://seedidiomas.com/aula-experimental/', null).then(() => {
    })
      .catch((error) => {
        console.log(error);
      })
  }
  shareEmail() {

  }
  async copyCode(code) {
    this.clipboard.copy(code);

    const toast = await this.toastCtrl.create({
      message: 'Código copiado.',
      duration: 2000
    });
    toast.present();
  }
}
