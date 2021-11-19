import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      let location = 'bandi'; 
      if(params.location){
        location = params.location;
      }
      if(location == 'bandi'){
        this.router.navigate(['/', Constants.bandiPath, Constants.ricercaPath]);
      } else {
        this.router.navigate(['/', Constants.programmiPath, Constants.ricercaPath]);
      }
    });
  }

}
