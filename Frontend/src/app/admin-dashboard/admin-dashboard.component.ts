import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // selectedUserTab = 1;
  // tabs = [
  //   {
  //     name: 'Dashboard',
  //     key: 1,
  //     active: true
  //   },
  //    {
  //    name: 'Jobs',
  //    key: 2,
  //    active: false
  //  },
  //  {
  //    name: 'Aplications',
  //    key: 3,
  //    active: false
  //  },
  //  {
  //    name: 'Clients',
  //    key: 4,
  //    active: false
  //  },
  //  {
  //   name: 'Aplicants',
  //   key: 5,
  //   active: false
  // },
  // ];
 
  constructor() { }

  ngOnInit() {
  }
  
  coinwallet: string[] = ['Dashboard','Jobs','Aplications','Clients','Aplicants'];
  selectedwallet = this.coinwallet[0];
}
