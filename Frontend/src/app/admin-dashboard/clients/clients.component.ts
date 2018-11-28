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
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = "companyName";
  currentSortDirection = 1;
  lastSortBy = "";
  currentFilter = "All";
  paginationSize: number[] = [];

  private clientsSub: Subscription;

  constructor(private clientService: ClientService) {}

  ngOnInit() {

    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
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

  calculatePagination(applicationCount: number) {
    this.paginationSize = [];
    const paginationSum = Math.ceil(applicationCount / 10);

    if (paginationSum > 0 && paginationSum < 11) {
      for (let i = 1; i < paginationSum + 1; i++) {
        const num = i;
        this.paginationSize.push(num);
      }
    } else if (paginationSum > 10) {
      if (this.currentPage - 10 < paginationSum - 10 && this.currentPage < 6) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.currentPage - 10 < paginationSum - 10) {
        for (let i = this.currentPage - 5; i < this.currentPage + 5; i++) {
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
    this.currentPage = page;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }
  onFilter(filterBy: string) {
    this.currentFilter = filterBy;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onSort(sortBy: any) {
    if (this.lastSortBy === sortBy) {
      this.currentSortDirection++;
    } else {
      this.lastSortBy = sortBy;
    }
    this.currentSortBy = sortBy;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
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
