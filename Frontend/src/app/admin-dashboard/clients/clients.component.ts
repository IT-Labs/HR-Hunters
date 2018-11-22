import { Component, OnInit, OnDestroy  } from '@angular/core';
// import { AdminService } from "src/app/services/admin.service";
// import { Subscription } from "rxjs";
import { Client } from 'src/app/models/client.model';


@Component({
  selector: 'app-ad-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ADClientsComponent implements OnInit, OnDestroy {
  dummyData: Client[] = [
    {
      id: "1",
      companyName: "firma1",
      logo: "mylogo1",
      email: "firma1@gmail.com",
      jobs: "1/1",
      status: "active"
    },
    {
      id: "1",
      companyName: "firma2",
      logo: "mylogo2",
      email: "firma2@gmail.com",
      jobs: "1/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
    {
      id: "1",
      companyName: "firma3",
      logo: "mylogo3",
      email: "firma3@gmail.com",
      jobs: "3/1",
      status: "inactive"
    },
   
  ];

  ClientsCount = {
    all: 11,
    active: 1,
    inactive: 10
  
  };
  Clients: Client[] = [];
  postsPerPage = 10;
  currentPage = 1;
  // currentSortBy = "Posted";
  currentSortDirection = 1;
  currentFilter = "All";
  // private applicationsSub: Subscription;
  // constructor(private adminService: AdminService) { }

    constructor() { }

  ngOnInit() {

  };
  // onChangedPage(pageData: any) {
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.postsPerPage = pageData.pageSize;
  //   this.currentFilter = pageData.filterBy;
  //   this.currentSortBy = pageData.sortedBy;
  //   this.currentSortDirection = pageData.sortDirection;
  //   this.adminService.getClients(
  //     // this.postsPerPage,
  //     // this.currentPage,
  //     // this.currentSortBy,
  //     // this.currentSortDirection,
  //     // this.currentFilter
  //   );
  // }
  //   onFilter(pageData: any) {
  //     this.currentPage = pageData.pageIndex;
  //     this.postsPerPage = pageData.pageSize;
  //     // this.currentFilter = the cliecked el;
  //     this.currentSortBy = pageData.sortedBy;
  //     this.currentSortDirection = pageData.sortDirection;
  //     this.adminService.getClients(
  //       // this.postsPerPage,
  //       // this.currentPage,
  //       // this.currentSortBy,
  //       // this.currentSortDirection,
  //       // this.currentFilter
  //     );

  //     }

  //     onSort(pageData: any) {
  //       this.currentPage = pageData.pageIndex;
  //       this.postsPerPage = pageData.pageSize;
  //       this.currentFilter = pageData.filterBy;
  //       // this.currentSortBy = the cliecked el;
  //       this.currentSortDirection = pageData.sortDirection + 1;
  //       this.adminService.getClients(
  //         // this.postsPerPage,
  //         // this.currentPage,
  //         // this.currentSortBy,
  //         // this.currentSortDirection,
  //         // this.currentFilter
  //       );
  //     }
    
  //   chooseStatus(event: any) {
  //     const currentStatus = event.target.innerText;
  //   }
  ngOnDestroy() {
    // this.applicationsSub.unsubscribe();
  }

}
