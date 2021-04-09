import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {
  album_name:any = '';
  album_cover:any = '';
  lessons:any;
  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state.lessons) {
        this.album_cover = getNav.extras.state.album_cover;
        this.album_name = getNav.extras.state.album_name;
        this.lessons = getNav.extras.state.lessons;
      } else {
        this.router.navigate(['/members/menu/master/listening/albuns']);
      }
    });
  }

  play(file){
    let navigationExtras: NavigationExtras = {
      state: {
        file: file,
        album_cover: this.album_cover
      }
    };
    this.router.navigate(['members/menu/master/listening/player'], navigationExtras);
  }
}
