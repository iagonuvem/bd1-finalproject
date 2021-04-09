import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from 'src/app/services/server.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-albuns',
  templateUrl: './albuns.page.html',
  styleUrls: ['./albuns.page.scss'],
})
export class AlbunsPage implements OnInit {
  albuns:any;
  constructor(private router: Router,
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
      this.server.protocol + this.server.host + this.server.port + "/listenings/getAll",
      httpOptions)
      .pipe(map(res => res)
      ).subscribe(response => {
        this.albuns = response;
      });
  }

  ngOnInit() {
    
  }
  
  files(album){
    let navigationExtras: NavigationExtras = {
      state: {
        lessons: album.lessons,
        album_name: album.name,
        album_cover: album.cover
      }
    };
    this.router.navigate(['members/menu/master/listening/files'], navigationExtras);
  }
}
