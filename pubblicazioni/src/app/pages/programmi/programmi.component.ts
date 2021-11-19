import { Component, OnInit } from '@angular/core';
import { ProgrammiService } from '../../shared/services/programmi-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programmi',
  templateUrl: './programmi.component.html',
  styleUrls: ['./programmi.component.css']
})
export class ProgrammiComponent implements OnInit {

  listaProgrammi : any = {};

  currentRow : any = {};

  

  constructor(private ProgrammiService: ProgrammiService,
    private router: Router) { }

  ngOnInit() {


    
  }
}