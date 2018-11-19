import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  selectedUserTab = 1;
  tabs = [
  
     {
     name: 'Jobs',
     key: 1,
     active: true
   },
   {
     name: 'Aplications',
     key: 2,
     active: false
   },
   {
     name: 'Clients',
     key: 3,
     active: false
   },
   {
    name: 'Aplicants',
    key: 4,
    active: false
  },
  ];
 
  constructor() { }

  ngOnInit() {
  }
  
  coinwallet: string[] = ['Jobs','Aplications','Clients','Aplicants'];
  selectedwallet = this.coinwallet[0];
}
