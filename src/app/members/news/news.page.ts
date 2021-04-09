import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from './../../services/server.service';
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  loading:any = true;
  news:any = [];
  noNews = false;
  constructor(
    private http: HttpClient,
    private server: ServerService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type':  this.server.headers["Content-type"]
      })
    };

    this.http.get(
      this.server.protocol+this.server.host+this.server.port+"/news/getAll",  
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(response => {
      // console.log(response);
      this.loading = false;
      this.news = response;
      for(var i in this.news){
        this.news[i]['relativeDate'] = moment(this.news[i].date).fromNow()
      }
      if(this.news.length == 0){
        this.noNews = true;
      }else{
        for(var i in this.news){
          if(this.news[i]['img']){
            this.news[i]['img'] = this.getImgBase64(this.news[i]['img']);
          }
        }
      }  
    })
  }

  getImgBase64(base64data){
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/*;base64,'+base64data);
  }
}
