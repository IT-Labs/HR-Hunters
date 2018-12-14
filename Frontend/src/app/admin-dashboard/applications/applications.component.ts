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
  paginationMaxSize = 0;

  applicationQP = {
    postsPerPage: 10,
    currentPage: 1,
    previousPage: 0,
    currentSortBy: "postedOn",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: null,
    currentFilterQuery: null
  };
  paginationSize: number[] = [];

  private applicationsSub: Subscription;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    const params = this.buildQueryParams(this.applicationQP);
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
      });
      setTimeout(() => {
        this.paginationMaxSize = this.applicationCount.all
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

  buildApplicationsDataOnUpdate(
    id: number,
    applicantFirstName: string,
    applicantLastName: string,
    applicantEmail: string,
    jobTitle: string,
    description: string,
    experience: number,
    postedOn: Date,
    status: string
  ) {
    let applicationData: Application = {
      id: id,
      applicantFirstName: applicantFirstName,
      applicantLastName: applicantLastName,
      applicantEmail: applicantEmail,
      jobTitle: jobTitle,
      description: description,
      experience: experience,
      postedOn: postedOn,
      status: status
    };
    return applicationData;
  }

  onChangedPage(page: number) {
    if (this.applicationQP.currentPage !== this.applicationQP.previousPage) {
      this.applicationQP.previousPage = this.applicationQP.currentPage;
      const params = this.buildQueryParams(this.applicationQP);
      this.applicationService.getApplications(params);
    }
  }

  onFilter(filterBy: string) {
    if (filterBy === null) {
      this.applicationQP.currentFilter = null;
    } else {
      this.applicationQP.currentFilter = "status";
    }

    // CALCULATE PAGINATION
    if (filterBy === null) {
      this.paginationMaxSize = this.applicationCount.all
    } else if (filterBy === 'Pending') {
      this.paginationMaxSize = this.applicationCount.pending
    } else if (filterBy === 'Contacted') {
      this.paginationMaxSize = this.applicationCount.contacted
    } else if (filterBy === 'Interviewed') {
      this.paginationMaxSize = this.applicationCount.interviewed
    } else if (filterBy === 'Hired') {
      this.paginationMaxSize = this.applicationCount.hired
    } else if (filterBy === 'Rejected') {
      this.paginationMaxSize = this.applicationCount.rejected
    }

    console.log(filterBy, this.paginationMaxSize)

    this.applicationQP.currentFilterQuery = filterBy;
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService.getApplications(params);
  }

  onSort(sortBy: string) {
    if (this.applicationQP.lastSortBy === sortBy) {
      if (this.applicationQP.currentSortDirection === 1) {
        this.applicationQP.currentSortDirection = 0;
      } else if (this.applicationQP.currentSortDirection === 0) {
        this.applicationQP.currentSortDirection = 1;
      }
      this.applicationQP.lastSortBy = "";
    } else if (this.applicationQP.lastSortBy !== sortBy) {
      if (this.applicationQP.currentSortDirection === 1) {
        this.applicationQP.currentSortDirection = 0;
      } else if (this.applicationQP.currentSortDirection === 0) {
        this.applicationQP.currentSortDirection = 1;
      }
      this.applicationQP.lastSortBy = sortBy;
    }
    this.applicationQP.currentSortBy = sortBy;
    const params = this.buildQueryParams(this.applicationQP);
    this.applicationService.getApplications(params);
  }

  chooseStatus(event: any, id: number) {
    const currentStatus = event.target.innerText;
    const currentId = id;
    const applicationData = this.buildApplicationsDataOnUpdate(
      currentId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      currentStatus
    );
    this.applicationService.updateApplication(applicationData);
  }

  ngOnDestroy() {
    this.applicationsSub.unsubscribe();
  }
}
