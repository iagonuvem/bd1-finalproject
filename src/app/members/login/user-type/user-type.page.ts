import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.page.html',
  styleUrls: ['./user-type.page.scss'],
})
export class UserTypePage implements OnInit {
  // user:any;
  data = {
    api_key: null
  };
  
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.data.api_key = getNav.extras.state.api_key;
      } else{
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit() {
  }
  
  goauthentication(type){
    let navigationExtras: NavigationExtras = {
      state: {
        api_key: this.data.api_key,
        userType: parseInt(type)
      }
    };
    this.router.navigate(['login/authentication'], navigationExtras);
  }

}
