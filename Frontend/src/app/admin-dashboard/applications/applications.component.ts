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
  currentSortBy = "posted";
  lastSortBy = "";
  currentSortDirection = 1;
  currentFilter = "All";
  paginationSize: number[] = [];

  private applicationsSub: Subscription;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
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
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.rejected = applicationsData.rejected
        this.calculatePagination(this.applicationCount.all);
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
    this.applicationService.getApplications(
      this.postsPerPage,
      this.currentPage,
      this.currentSortBy,
      this.currentSortDirection,
      this.currentFilter
    );
  }

  onFilter(filterBy: string) {
    this.currentFilter = filterBy;
    this.applicationService.getApplications(
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
    this.applicationService.getApplications(
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
    let currentApplication: Application;
    for (let i = 0; i < this.applications.length; i++) {
      if (currentId === this.applications[i].id) {
        currentApplication = this.applications[i];
      }
    }

    this.applicationService.updateApplication(
      currentId,
      currentApplication.applicantFirstName,
      currentApplication.applicantLastName,
      currentApplication.applicantEmail,
      currentApplication.jobTitle,
      currentApplication.experience,
      currentApplication.postedOn,
      currentStatus
    );
  }

  ngOnDestroy() {
    this.applicationsSub.unsubscribe();
  }
}
