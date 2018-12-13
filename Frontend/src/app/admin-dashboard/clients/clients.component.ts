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
    previousPage: 0,
    currentSortBy: "companyName",
    lastSortBy: "",
    currentSortDirection: 1,
    currentFilter: null,
    currentFilterQuery: null
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
      });
  }
  
  buildQueryParams(data) {
    if (data.currentFilter === null) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}`;
    }
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}`;
  }

  buildClientDataOnUpdate(
    id: number,
    email: string,
    companyName: string,
    logo: File | string,
    activeJobs: number,
    allJobs: number,
    status: string,
    location: string
  ) {
    let clientData: Client | FormData;
    if (typeof logo === "object") {
      clientData = new FormData();
      clientData.append("id", id.toString());
      clientData.append("email", email);
      clientData.append("companyName", companyName);
      clientData.append("logo", logo, companyName);
      clientData.append("activeJobs", activeJobs.toString());
      clientData.append("allJobs", allJobs.toString());
      clientData.append("status", status);
      clientData.append("location", location);
    } else {
      clientData = {
        id: id,
        email: email,
        companyName: companyName,
        logo: logo,
        activeJobs: activeJobs,
        allJobs: allJobs,
        status: status,
        location: location
      };
    }
    return clientData;
  }

  onChangedPage(page: number) {
    if (this.clientQP.currentPage !== this.clientQP.previousPage) {
      this.clientQP.previousPage = this.clientQP.currentPage;
      const params = this.buildQueryParams(this.clientQP);
      this.clientService.getClients(params);
    }
  }

  onFilter(filterBy: string) {
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
      if (this.clientQP.currentSortDirection === 1) {
        this.clientQP.currentSortDirection = 0;
      } else if (this.clientQP.currentSortDirection === 0) {
        this.clientQP.currentSortDirection = 1;
      }
      this.clientQP.lastSortBy = '';
    } else if (this.clientQP.lastSortBy !== sortBy) {
      if (this.clientQP.currentSortDirection === 1) {
        this.clientQP.currentSortDirection = 0;
      } else if (this.clientQP.currentSortDirection === 0) {
        this.clientQP.currentSortDirection = 1;
      }
      this.clientQP.lastSortBy = sortBy;
    }
    this.clientQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.clientQP)
    this.clientService.getClients(params);
  }

  chooseStatus(event: any, id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;
    
    let clientData = this.buildClientDataOnUpdate(
      currentId,
      null,
      null,
      null,
      null,
      null,
      currentStatus,
      null
    );
    
    this.clientService.updateClient(clientData);
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }
}
