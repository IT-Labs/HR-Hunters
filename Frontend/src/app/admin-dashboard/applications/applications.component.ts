import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Application } from "src/app/models/application.model";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  selector: "app-ad-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"]
})
export class ADApplicationsComponent implements OnInit, OnDestroy {
  

  applicationCount = {
    all: 0,
    pending: 0,
    contacted: 0,
    interviewed: 0,
    rejected: 0,
  };
  applications: Application[] = [];
  postsPerPage = 10;
  currentPage = 1;
  currentSortBy = "Posted";
  currentSortDirection = 1;
  currentFilter = "All";
  private applicationsSub: Subscription;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    // this.adminService.getApplications(this.postsPerPage, this.currentPage, this.currentSortBy, this.currentSortDirection, this.currentFilter);
    // this.adminService
    //   .getApplicationsUpdateListener()
    //   .subscribe(
    //     (applicationsData: {
    //       applications: Application[];
    //       applicationsCount: number;
    //     }) => {
    //       this.applicationCount.all = applicationsData.applicationsCount;
    //       this.applications = applicationsData.applications;
    //     }
    //   );
    this.applicationService.getApplications(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
    this.applicationsSub = this.applicationService
      .getApplicationsUpdateListener()
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.applicationsCount;
      });
  }

  onChangedPage(pageData: any) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.currentFilter = pageData.filterBy;
    this.currentSortBy = pageData.sortedBy;
    this.currentSortDirection = pageData.sortDirection;
    this.applicationService.getApplications(
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
    this.applicationService.getApplications(
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
    this.applicationService.getApplications(
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
    // this.applicationsSub.unsubscribe();
  }
}
