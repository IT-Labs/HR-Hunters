import { Component, OnInit, OnDestroy } from "@angular/core";
import { Client } from "src/app/models/client.model";
import { Subscription } from "rxjs";
import { ClientService } from "src/app/services/client.service";

@Component({
  selector: "app-ad-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.scss"]
})
export class ADClientsComponent implements OnInit, OnDestroy {
  clientsCount = {
    all: 0,
    active: 0,
    inactive: 0
  };
  clients: Client[] = [];

  clientQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "companyName",
    lastSortBy: "",
    currentSortDirection: 1,
    currentFilter: 'status',
    currentFilterQuery: 0
  }

  paginationSize: number[] = [];

  private clientsSub: Subscription;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    const params = this.buildQueryParams(this.clientQP)
    this.clientService.getClients(params);
    this.clientsSub = this.clientService
      .getClientsUpdateListener()
      .subscribe(clientsData => {
        this.clients = clientsData.clients;
        this.clientsCount.all = clientsData.clientsCount;
        this.clientsCount.active = clientsData.active;
        this.clientsCount.inactive = clientsData.inactive;
        this.calculatePagination(this.clientsCount.all)
      });
  }
  
  buildQueryParams(data) {
    return `?pagesize=${data.postsPerPage}
            &page=${data.currentPage}
            &sort=${data.currentSortBy}
            &sortDir=${data.currentSortDirection}
            &filterBy=${data.currentFilter}
            &filterQuery=${data.currentFilterQuery}`;
  }

  calculatePagination(applicationCount: number) {
    this.paginationSize = [];
    const paginationSum = Math.ceil(applicationCount / 10);

    if (paginationSum > 0 && paginationSum < 11) {
      for (let i = 1; i < paginationSum + 1; i++) {
        const num = i;
        this.paginationSize.push(num);
      }
    } else if (paginationSum > 10) {
      if (this.clientQP.currentPage - 10 < paginationSum - 10 && this.clientQP.currentPage < 6) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.clientQP.currentPage - 10 < paginationSum - 10) {
        for (let i = this.clientQP.currentPage - 5; i < this.clientQP.currentPage + 5; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else {
        for (let i = paginationSum - 9; i < paginationSum + 1; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      }
    }
  }

  onChangedPage(page: number) {
    this.clientQP.currentPage = page;
    const params = this.buildQueryParams(this.clientQP)
    this.clientService.getClients(params);
  }
  onFilter(filterBy: number) {
   
    if (filterBy === null) {
      this.clientQP.currentFilter = null
    } else {
      this.clientQP.currentFilter = 'status'
    }

    this.clientQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.clientQP)
    this.clientService.getClients(params);
  }

  onSort(sortBy: string) {
    if (this.clientQP.lastSortBy === sortBy) {
      this.clientQP.currentSortDirection = 1;
    } else {
      this.clientQP.lastSortBy = sortBy;
      this.clientQP.currentSortDirection = 0;
    }
    this.clientQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.clientQP)
    this.clientService.getClients(params);
  }

  chooseStatus(event: any, id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;
    let currentClient: Client;
    for (let i = 0; i < this.clients.length; i++) {
      if (currentId === this.clients[i].id) {
        currentClient = this.clients[i];
      }
    }

    this.clientService.updateClient(
      currentId,
      currentClient.email,
      currentClient.companyName,
      currentClient.logo,
      currentClient.activeJobs,
      currentClient.allJobs,
      currentStatus,
      currentClient.location
    );
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }
}
