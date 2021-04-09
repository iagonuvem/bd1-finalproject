import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ServerService } from './../../services/server.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  events:any;
  noEvents = false;
  loadingEvents = true;
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
      this.server.protocol+this.server.host+this.server.port+"/events/getAll",  
      httpOptions)
    .pipe(map(res => res)
    ).subscribe(response => {
      this.loadingEvents = false;
      this.events = response;
      // console.log(this.events);
      if(this.events.length == 0){
        this.noEvents = true;
      }
    })
  }

  getImgBase64(base64data){
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/*;base64,'+base64data);
  }

}
