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
  currentSortBy = "Posted";
  currentSortDirection = 1;
  currentFilter = "All";
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
      });
  }

  onChangedPage(pageData: any) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }
  onFilter(pageData: any) {
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    // this.currentFilter = the cliecked el;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onSort(pageData: any) {
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    // this.currentSortBy = the cliecked el;
    this.currentSortDirection = pageData.sortDirection + 1;
    this.clientService.getClients(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  chooseStatus(event: any) {
    const currentStatus = event.target.innerText;
  }
  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }
}
