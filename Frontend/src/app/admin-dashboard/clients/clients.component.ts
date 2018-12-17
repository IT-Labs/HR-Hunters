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
  paginationMaxSize = 0;

  clientQP = {
    postsPerPage: 10,
    currentPage: 1,
    previousPage: 0,
    currentSortBy: "companyName",
    lastSortBy: "",
    currentSortDirection: 1,
    currentFilter: null,
    currentFilterQuery: null
  };

  loading = false;

  paginationSize: number[] = [];

  private clientsSub: Subscription;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loading = true;
    const params = this.buildQueryParams(this.clientQP);
    this.clientService.getClients(params);
    this.clientsSub = this.clientService
      .getClientsUpdateListener()
      .subscribe(clientsData => {
        this.clients = clientsData.clients;
        this.clientsCount.all = clientsData.clientsCount;
        this.clientsCount.active = clientsData.active;
        this.clientsCount.inactive = clientsData.inactive;
        this.loading = false;
      });
    setTimeout(() => {
      this.paginationMaxSize = this.clientsCount.all;
    }, 1000);
  }

  buildQueryParams(data) {
    if (data.currentFilter === null) {
      return `?pageSize=${data.postsPerPage}&currentPage=${
        data.currentPage
      }&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}`;
    }
    return `?pageSize=${data.postsPerPage}&currentPage=${
      data.currentPage
    }&sortedBy=${data.currentSortBy}&sortDir=${
      data.currentSortDirection
    }&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}`;
  }

  buildClientDataOnUpdateStatus(
    id: number,
    status: string
  ) {
    let clientData = {
        id: id,
        status: status
      };
    return clientData;
  }


  //DA SE PREMESTI SMESTA NA BOLJE MESTO
  buildClientDataOnUpdateProfile(
    id: number,
    companyName: string,
    email: string,
    location: string,
    activeJobs: number,
    allJobs: number,
    status: string
  ) {
    let clientData: Client = {
        id: id,
        companyName: companyName,
        email: email,
        location: location,
        activeJobs: activeJobs,
        allJobs: allJobs,
        status: status
      };
    return clientData;
  }

  onChangedPage(page: number) {
    this.loading = true;
    if (this.clientQP.currentPage !== this.clientQP.previousPage) {
      this.clientQP.previousPage = this.clientQP.currentPage;
      const params = this.buildQueryParams(this.clientQP);
      this.clientService.getClients(params);
      this.loading = false;
    }
  }

  onFilter(filterBy: string) {
    this.loading = true;
    if (filterBy === null) {
      this.clientQP.currentFilter = null;
    } else {
      this.clientQP.currentFilter = "status";
    }

    // CALCULATE PAGINATION
    if (filterBy === null) {
      this.paginationMaxSize = this.clientsCount.all
    } else if (filterBy === 'Active') {
      this.paginationMaxSize = this.clientsCount.active
    } else if (filterBy === 'Inactive') {
      this.paginationMaxSize = this.clientsCount.inactive
    }

    this.clientQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.clientQP);
    this.clientService.getClients(params);
    this.loading = false;
  }

  onSort(sortBy: string) {
    this.loading = true;
    if (this.clientQP.lastSortBy === sortBy) {
      if (this.clientQP.currentSortDirection === 1) {
        this.clientQP.currentSortDirection = 0;
      } else if (this.clientQP.currentSortDirection === 0) {
        this.clientQP.currentSortDirection = 1;
      }
      this.clientQP.lastSortBy = "";
    } else if (this.clientQP.lastSortBy !== sortBy) {
      if (this.clientQP.currentSortDirection === 1) {
        this.clientQP.currentSortDirection = 0;
      } else if (this.clientQP.currentSortDirection === 0) {
        this.clientQP.currentSortDirection = 1;
      }
      this.clientQP.lastSortBy = sortBy;
    }
    this.clientQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.clientQP);
    this.clientService.getClients(params);
    this.loading = false;
  }

  chooseStatus(event: any, id: number) {
    this.loading = true;
    const currentStatus = event.target.innerText;
    const currentId = id;

    let clientData = this.buildClientDataOnUpdateStatus(
      currentId,
      currentStatus
    );
    this.clientService.updateClientStatus(clientData);
    setTimeout(() => {
      const params = this.buildQueryParams(this.clientQP);
      this.clientService.getClients(params);
      this.loading = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }
}
