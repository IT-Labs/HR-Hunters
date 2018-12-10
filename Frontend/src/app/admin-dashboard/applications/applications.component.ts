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
    hired: 0,
    rejected: 0
  };
  applications: Application[] = [];

  applicationQP = {
    postsPerPage: 10,
    currentPage: 1,
    currentSortBy: "postedOn",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: 'status',
    currentFilterQuery: null
  };
  paginationSize: number[] = [];

  private applicationsSub: Subscription;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    const params = this.buildQueryParams(this.applicationQP)
    this.applicationService.getApplications(params);
    this.applicationsSub = this.applicationService
      .getApplicationsUpdateListener()
      .subscribe(applicationsData => {
        this.applications = applicationsData.applications;
        this.applicationCount.all = applicationsData.applicationsCount;
        this.applicationCount.pending = applicationsData.pending;
        this.applicationCount.contacted = applicationsData.contacted;
        this.applicationCount.interviewed = applicationsData.interviewed;
        this.applicationCount.hired = applicationsData.hired;
        this.applicationCount.rejected = applicationsData.rejected;
        this.calculatePagination(this.applicationCount.all);
      });
  }

  buildQueryParams(data) {
    return `?pageSize=${data.postsPerPage}&currentPage=${data.currentPage}&sortedBy=${data.currentSortBy}&sortDir=${data.currentSortDirection}&filterBy=${data.currentFilter}&filterQuery=${data.currentFilterQuery}`;
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
      if (
        this.applicationQP.currentPage - 10 < paginationSum - 10 &&
        this.applicationQP.currentPage < 6
      ) {
        for (let i = 1; i < 11; i++) {
          const num = i;
          this.paginationSize.push(num);
        }
      } else if (this.applicationQP.currentPage - 10 < paginationSum - 10) {
        for (
          let i = this.applicationQP.currentPage - 5;
          i < this.applicationQP.currentPage + 5;
          i++
        ) {
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
    this.applicationQP.currentPage = page;
    const params = this.buildQueryParams(this.applicationQP)
    this.applicationService.getApplications(params);
  }

  onFilter(filterBy: string) {
    
    if (filterBy === null) {
      this.applicationQP.currentFilter = null
    } else {
      this.applicationQP.currentFilter = 'status'
    }

    this.applicationQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.applicationQP)
    this.applicationService.getApplications(params);
  }

  onSort(sortBy: string) {
    if (this.applicationQP.lastSortBy === sortBy) {
      this.applicationQP.currentSortDirection = 0;
    } else {
      this.applicationQP.currentSortDirection = 1;
      this.applicationQP.lastSortBy = sortBy;
    }
    this.applicationQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.applicationQP)
    this.applicationService.getApplications(params);
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
