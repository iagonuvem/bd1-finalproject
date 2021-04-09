import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.page.html',
  styleUrls: ['./partner.page.scss'],
})
export class PartnerPage implements OnInit {
  partnerInfo:any;
  constructor(private route: ActivatedRoute, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras) {
        this.partnerInfo = getNav.extras;
      } else{
        this.router.navigate(['/members/menu/master/premium']);
      }
    });
  }

  ngOnInit() {
  }

}
