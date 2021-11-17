import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SpinApp';
  
  show: boolean;

  constructor() {
    this.show = false;
    for (var i = 0; i < localStorage.length; i++) {
      if(localStorage.key(i).startsWith('pc-')){
        localStorage.removeItem(localStorage.key(i));
      }
      
    }
    
  }

  toggleNavbar(){
    this.show = !this.show;
  } 
  
}
