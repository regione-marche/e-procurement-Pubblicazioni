import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  show: boolean;

  constructor() {
    this.show = false;
  }

  toggleNavbar(){
    this.show = !this.show;
  }

  ngOnInit() {
  }


}
