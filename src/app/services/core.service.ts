import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  public userData:any;
  public instagram_access_token = null;

  constructor(
    private server: ServerService,
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform) {
    this.storage.get('userData').then(async (userData) => {
      this.userData = userData;
      await this.getSettings(userData['_id']);
    })  
  }

  public getSettings(_id){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': this.server.headers["Content-type"],
        'Access-Control-Allow-Origin': '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    let data = {
      "_id": _id
    }

    return new Promise((resolve,reject) => {
      try {
        this.http.post(
          this.server.protocol+this.server.host+this.server.port+'/settings/getPublic',  
          data,
          httpOptions)
        .pipe(map(res => res)
        ).subscribe(async response => {
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    })
    
  }

  public getCalendarByAPIKey(apikey:String){
    if(apikey == '0935C4'){ // João Monlevade
      return 'd1m5jhjatlfo0rgkibj97gfkb0@group.calendar.google.com';
    }
    if(apikey == '3264F7'){ // Contagem
      return 'cjid1l2o6clun96tib13b89qsk@group.calendar.google.com';
    }
    if(apikey == '068EE5'){ // Caratinga
      return 'flkdtut40es76k3lgl5ca8anao@group.calendar.google.com';
    }
  }

  public getGApiKey(){
    return 'AIzaSyAIqBVKFOej2lnR6idfPu9paPnPphhtZgI';
  }

  public getGClientId(){
    if (this.platform.is('ios')) {
      return '7871070123-hnj7kpmamqtqvrt72tbqredplu7ent47.apps.googleusercontent.com'; // ios
    } else if (this.platform.is('android')) {
      return '7871070123-hnj7kpmamqtqvrt72tbqredplu7ent47.apps.googleusercontent.com'; // Android
    } else {
      return '7871070123-o1h8g657po62jl2mk4qf5iomdgc38bbl.apps.googleusercontent.com'; // Web APP
    }
  }

  public refreshUserData(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': this.server.headers["Content-type"],
        'Access-Control-Allow-Origin': '*',
        'Accept': this.server.headers["Content-type"]
      })
    };

    let data = {
      "_id": this.userData._id
    }

    return new Promise((resolve,reject) => {
      try {
        this.http.post(
          this.server.protocol+this.server.host+this.server.port+'/users/getByMongoId',  
          data,
          httpOptions)
        .pipe(map(res => res)
        ).subscribe(async response => {
          this.storage.set('userData', response);
          this.userData = response;
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  public getUserData(){
    return this.userData;
  }
}
