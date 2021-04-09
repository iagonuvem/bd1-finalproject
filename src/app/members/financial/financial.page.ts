import { Component, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ServerService } from 'src/app/services/server.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController, PopoverController } from '@ionic/angular';
import { PopoverFinancialComponent } from '../modals/popover-financial/popover-financial.component'

@Component({
  selector: 'app-financial',
  templateUrl: './financial.page.html',
  styleUrls: ['./financial.page.scss'],
})
export class FinancialPage implements OnInit {
  splash = true;
  activeTab = 'debits';
  userData = {};
  debits = [];
  payed = [];
  contracts = [];
  groupedContracts = [];
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private server: ServerService,
    private clipboard: Clipboard,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController
  ) {
    this.storage.get('userData').then((userData) => {
      this.userData = userData;
      this.getByPage(1);
    })
  }

  /**
   * Função RECURSIVA para buscar todas as páginas
   * @param page numero da pagina
   */
  async getByPage(page){
    if(page==null){
      return;
    }
    else{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-type':  this.server.headers["Content-type"]
        })
      };
     
      /** Faz Chamada apenas para ultima turma no objeto */
      this.http.post(
        this.server.protocol+this.server.host+this.server.port+'/financials/getAll', 
        {
          student_id: this.userData["student_id"],
          api_key: this.userData["api_key"],
          page_number: page
        }, 
        httpOptions)
      .pipe(map(res => res))
      .subscribe(async (response:any) => {
        if(response['status'] == 0){
          var contracts = this.groupBy(this.contracts, 'status');

          this.debits = contracts[0];
          this.payed = contracts[1];
          // for(var i in contracts){
          //   this.groupedContracts.push(contracts[i]);
          // }
          this.splash = false;
          return response; // Para execução
        }
        else{
          await this.getByPage(page+1).then(() => {
            for(var i in response['data']){
              this.contracts.push(response['data'][i]);
            }
            
          });
        }
      });
      
    }
  }

  groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  ngOnInit() {
  }

  tabChanged(event){
    this.activeTab = event.detail.value;
  }

  async copyField(field){
    this.clipboard.copy(field);
    const popover = await this.popoverCtrl.create({
      component: PopoverFinancialComponent,
      componentProps: {field: field},
      translucent: true
    });
    return await popover.present();
    
  }

}
